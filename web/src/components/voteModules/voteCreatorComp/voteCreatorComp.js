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
      snackbar: false,
      snackMessage: '',
      votes: [],
      lastRecordId: 0,
      paginatorRowsPerPageOptions: [ 10, 25, 50 ],
      paginatorCurrentRow: 15,
      paginatorTotalRecords: 0,
      paginatorSideNumber: 0,
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
      await axios.post(`${config.API_URL}/vote/createNewVote`, {
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
          console.error(err);

          this.snackMessage =  err.response.data.errorDetails.message;
          this.snackbar = true;
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
          console.log(res);
          this.paginatorTotalRecords = res.data;

          this.snackMessage = res.data.message;
          this.snackbar = true;
          return;
        })
        .catch(err => {
          console.error(err);

          this.snackMessage =  err.response.data.errorDetails.message;
          this.snackbar = true;
        });
    },
    async initData() {
      if ( this.votes.length === 0 ) {
        await this.getAllVotesSize();
        await this.getVotes();
      }
    },
    addVotesToArray(data) {
      if ( data == null || data == undefined)
        return;
      data.forEach(vote => {
        this.votes.push(vote);
      })
    },
    getLastIdFormVotesArray() {
      const lastIndex = this.votes.length - 1;
      return this.votes[lastIndex]._id;
    },
  },
};
