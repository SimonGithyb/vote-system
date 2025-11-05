import config from '@/config';
import axios from 'axios';

import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

export default {
  name: 'vote-creator',
  components: {
    Dialog,
    Button,
    InputText,
    Paginator,
  },
  data () {
    return {
      userId: localStorage.getItem('userId'),
      stage: 'creator',
      accessToken: localStorage.getItem('accessToken'),
      voteName: '',
      questionQuentity: 0,
      questionLimit: 10,
      questions: [
        {
          name: 'test',
          visible: false,
          answerQuentity: 0,
          answers: [],
        }
      ],
      voteExpiry: '',
      voteType: 'private',
      voteId: '',
      editedVoteIndex: '',
      snackbar: false,
      snackMessage: '',
      votes: [],
      lastRecordId: 0,
      paginatorRowsPerPageOptions: [ 10, 25, 50 ],
      paginatorCurrentRow: 10,
      paginatorTotalRecords: 0,
      paginatorSideNumber: 1,
    }
  },
  methods: {
    changeStage(newStage) {
      this.stage = newStage;

      switch (newStage) {
        case 'allCreatedVotes':
          this.initData();
        break;
        default:
          
        break;
      }

    },
    addQuestion() {
      if (this.questionQuentity >= 10) {
        this.snackMessage = 'Cant create more answer that 10';
        this.snackbar = true;
        return;
      }

      this.questionQuentity++;
      this.questions.push({
          name: '',
          answerQuentity: 0,
          answers: [],
        });
    },
    addAnswer(questionIndex) {
      if (this.questions[questionIndex].answerQuentity >= 10) {
        this.snackMessage = 'Cant create more question that 10';
        this.snackbar = true;
        return;
      }
      this.questions[questionIndex].answerQuentity++;
    },
    async createNewVote() {
      await axios.post(`${config.API_URL}/vote`, {
        name: this.voteName,
        type: this.voteType,
        questions: JSON.stringify(this.questions),
        userId: this.userId,
        expiryDate: Date.parse(this.voteExpiry),
      }, {
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.accessToken,
          }
      })
      .then(res => {
        if ( res.data.error) {
          this.snackMessage = res.data.errorDetails.message;
          this.snackbar = true;
          return;
        }

        this.snackMessage = res?.data?.message;
        this.snackbar = true;
        return;
      })
      .catch(err => {
        console.error(err);

        this.snackMessage =  err.response.data.errorDetails.message || err.message;
        this.snackbar = true;
        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
      });
    },  
    async getVotes() {
      await axios.get(`${config.API_URL}/vote/getVote/${this.userId}/${this.lastRecordId}/${this.paginatorCurrentRow}`, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.accessToken,
        }
      })
      .then(res => {

          if ( res.data.error) {
          this.snackMessage = res.data.errorDetails.message;
          this.snackbar = true;
          return;
        }

        this.addVotesToArray(res.data);

        this.lastRecordId = this.getLastIdFormVotesArray();

        this.snackMessage = res.data.message || 'Get data succesful!';
        this.snackbar = true;
        return;
      })
      .catch(err => {
        this.snackMessage =  err.response.data.errorDetails.message;
        this.snackbar = true;

        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
      });
    },
    async getAllVotesSize() {
      await axios.get(`${config.API_URL}/vote/getVoteSize/${this.userId}`, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.accessToken,
        }
      })
      .then(res => {

          if ( res.data.error) {
          this.snackMessage = res.data.errorDetails.message;
          this.snackbar = true;
          return;
        }
        this.paginatorTotalRecords = res.data;

        this.snackMessage = res.data.message;
        this.snackbar = true;
        return;
      })
      .catch(err => {
        console.error(err);

        this.snackMessage =  err.response.data.errorDetails.message;
        this.snackbar = true;

        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
      });
    },
    async initData() {
      if ( this.votes.length === 0 ) {
        await this.getAllVotesSize();
        await this.getVotes();
      }
    },
    addVotesToArray(data) {
      if ( data == null || data == undefined || data.length == 0)
        return;
      data.forEach(vote => {
        vote.active = this.checkActiveVote(vote.expiryDate);
        this.votes.push(vote);
      })
    },
    getLastIdFormVotesArray() {
      const lastIndex = this.votes.length - 1;
      return this.votes[lastIndex]._id;
    },
    checkActiveVote(expiryDate) {
      return expiryDate - new Date() < 0 ? false : true;
    },
    async deleteVote(id, index) {
      await axios.delete(`${config.API_URL}/vote/${id}`, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.accessToken,
        }
    })
    .then(res => {
        if ( res.data.error) {
        this.snackMessage = res.data.errorDetails.message;
        this.snackbar = true;
        return;
      }

      this.deleteFormVotesArray(index);
      this.snackMessage = res.data.message || "Delete with success!";
      this.snackbar = true;
      return;
    })
    .catch(err => {
      console.error(err);

      this.snackMessage =  err.response.data.errorDetails.message;
      this.snackbar = true;

        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
    });
    },
    deleteFormVotesArray(index) {
      this.votes.splice(index, 1);
    },
    async editVote(vote, index) {
      this.editedVoteIndex = index;
      this.stage = 'edit';
      this.voteName = vote.name;
      this.questions = vote.questions;
      this.voteId = vote._id;
      this.voteExpiry = this.msDateToDateTimeFormat(vote.expiryDate);
      this.voteType = vote.type;
    },
    msDateToDateTimeFormat(dateInMs) {
      return new Date(dateInMs).toISOString().slice(0, 16);
    },
    async saveEditVote() {
      await axios.put(`${config.API_URL}/vote/${this.voteId}`, {
          name: this.voteName,
          type: this.voteType,
          questions: JSON.stringify(this.questions),
          userId: this.userId,
          expiryDate: Date.parse(this.voteExpiry),
        }, 
        {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.accessToken,
        },
      })
      .then(res => {

          if ( res.data.error) {
          this.snackMessage = res.data.errorDetails.message;
          this.snackbar = true;
          return;
        }

        this.snackMessage = res.data.message || 'Edit with success!';
        this.snackbar = true;
        this.editInVoteArray(this.editedVoteIndex);
        this.clearVoteFieldsAfterEdit();
        this.changeStage('allCreatedVotes');
        return;
      })
      .catch(err => {
        this.snackMessage =  err.response.data.errorDetails.message;
        this.snackbar = true;

        if (err.response.statusText === 'Unauthorized') {
          localStorage.clear();
          location.reload();
        }
      });
    },
    editInVoteArray(index) {
      this.votes[index].name = this.voteName;
      this.votes[index].questions = this.questions;
      this.votes[index].expiryDate = this.voteExpiry;
      this.votes[index].type = this.voteType;
    },
    clearVoteFieldsAfterEdit() {
      this.voteName = '';
      this.questions = '';
      this.voteExpiry = '';
      this.voteType = 'private';
    },
    async getResultsVote(id) {
      await axios.get(`${config.API_URL}/vote/results/${id}`, {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.accessToken,
        }
    })
    .then(res => {

        if ( res.data.error) {
        this.snackMessage = res.data.errorDetails.message;
        this.snackbar = true;
        return;
      }

      this.snackMessage = res.data.message;
      this.snackbar = true;
      return;
    })
    .catch(err => {
      console.error(err);

      this.snackMessage =  err.response.data.errorDetails.message;
      this.snackbar = true;

      if (err.response.statusText === 'Unauthorized') {
        localStorage.clear();
        location.reload();
      }
    });
    },
  },
};
