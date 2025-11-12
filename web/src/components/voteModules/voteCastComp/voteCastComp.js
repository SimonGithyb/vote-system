import config from '@/config';
import axios from 'axios';

import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

export default {
  name: 'vote-cast',
  components: {
    Dialog,
    Button,
    InputText,
    Paginator,
  },
  data () {
    return {
      accessToken: localStorage.getItem('accessToken'),
      userId: localStorage.getItem('userId'),
      session: false,
      stage: 'first',
      selectedCategory: '',
      category: [
        {
          active: 'all',
          name: 'allVotes',
          title: 'You can see all votes',
          signature: 'All votes',
          headerTitle: 'All votes!',
        }, {
          active: true,
          name: 'OnlyActiveVotes',
          title: 'You can see only votes where you can give vote',
          signature: 'Active votes',
          headerTitle: 'Voting in progress!',
        }, {
          active: false,
          name: 'OnlyEndedVotes',
          title: 'You can see ended votes and see results',
          signature: 'Ended votes',
          headerTitle: 'Vote ended!',
        },
      ],
      votes: [],
      isDialog: false,
      selectVoteIndex: 0,
      currentQuestionIndex: 0,
      allQuestionsIndexs: 0,
      answers: [],
      answer: '',
      snackbar: false,
      snackMessage: '',
      voteName: '',
      questions: [],
      resultsDialog: false,
      voteResults: [],
    };
  },
  methods: {
    changeStage(newStage, idx) {
      this.stage = newStage;
      this.selectedCategory = this.category[idx];

      this.checkSessionAndInitData();
    },
    async getVoteSession() {
      const voteRage = this.selectedCategory.active;

      await axios.get(`${config.API_URL}/vote/getVotes/${voteRage}`, {
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
          
          res.data.forEach(element => {
            element.active = this.checkActiveVote(element.expiryDate);
          });

          this.votes = res.data;
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
    checkActiveVote(expiryDate) {
      return expiryDate - new Date() < 0 ? false : true;
    },
    async getVoteNoSession() {
      const voteRage = this.selectedCategory.active;

      await axios.get(`${config.API_URL}/vote/getVotesNoSession/${voteRage}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(res => {

          if ( res.data.error) {
              this.snackMessage = res.data.errorDetails.message;
              this.snackbar = true;
              return;
          }

          res.data.forEach(element => {
            element.active = this.checkActiveVote(element.expiryDate);
          });

          this.votes = res.data;
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
    checkSessionAndInitData() {
      this.session = localStorage.getItem('session');

      if (this.session)
        return this.getVoteSession();

      this.getVoteNoSession();

    },
    openVote(index) {
      if ( !this.votes[index].active ) {
        console.log('work')
        this.snackMessage =  'This vote is ended! You cant give your vote! Too late!';
        this.snackbar = true;
        return; 
      } 
      this.selectVoteIndex = index;
      this.allQuestionsIndexs = this.votes[index].questions.length;
      this.isDialog = true;
    },
    saveAnswer() {
      this.answers[this.currentQuestionIndex] = this.answer;
    },
    nextQuestion() {
      if( this.currentQuestionIndex >= this.allQuestionsIndexs - 1 ) {
        return;
      }
      this.currentQuestionIndex++;
      this.answer = this.answers[this.currentQuestionIndex];
    },
    previousQuestion() {
      if ( this.currentQuestionIndex <= 0 )
        return;
      this.currentQuestionIndex--;
      this.answer = this.answers[this.currentQuestionIndex];
    },
    async saveVoteResult() {
      await axios.post(`${config.API_URL}/vote/saveVoteCast`, {
        answers: this.answers,
        voteId: this.votes[this.selectVoteIndex]._id,
        userId: this.userId,
      }, {
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          }
      })
      .then(res => {

        if ( res.data.error) {
            this.snackMessage = res.data.errorDetails.message;
            this.snackbar = true;
            return;
        }

        this.snackMessage = res.data.message || "Your vote is saved!";
        this.snackbar = true;
        this.isDialog = false;
        return;
      })
      .catch(err => {
        console.error(err);

        this.snackMessage =  err.response.data.errorDetails.message;
        this.snackbar = true;
      });
    },
    async getResultsVote(id) {
      await axios.get(`${config.API_URL}/vote/voteResults/${id}/${this.userId}`, {
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

      this.voteResults = res.data.data;
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
    openResultsVote(vote) {
      this.getResultsVote(vote._id);
      this.voteName = vote.name;
      this.questions = vote.questions;
      this.allQuestionsIndexs = vote.questions.length;
      this.currentQuestionIndex = 0;
      this.resultsDialog = true;
    },
    onAcess(name) {
      this.snackbar = true;
      this.snackMessage = `You havent access to results for vote: ${name}`
    }
  }
}
