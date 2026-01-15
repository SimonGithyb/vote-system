import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

import httpService from '@/services/http.service';
import { useSnackbarStore } from '@/stores/snackbar';

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
      const votes = await httpService.getVoteByActive(this.selectedCategory.active);
      this.votes = this.checkActiveVoteStatus(votes);
    },
    checkActiveVote(expiryDate) {
      return expiryDate - new Date() < 0 ? false : true;
    },
    async getVoteNoSession() {
      const votes = await httpService.getVoteWithoutSession(this.selectedCategory.active);
      this.votes = this.checkActiveVoteStatus(votes);
      console.log(this.votes)
    },
    checkActiveVoteStatus(data) {
      data.forEach(element => {
        element.active = this.checkActiveVote(element.expiryDate);
      });
      return data;
    },
    checkSessionAndInitData() {
      this.session = localStorage.getItem('session');

      if (this.session)
        return this.getVoteSession();

      this.getVoteNoSession();

    },
    openVote(index) {
      if ( !this.votes[index].active ) {
        const snackbar = useSnackbarStore();
        snackbar.show( 'This vote is ended! You cant give your vote! Too late!');
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
      await httpService.saveVoteCast({
        answers: this.answers,
        voteId: this.votes[this.selectVoteIndex]._id,
        userId: this.userId,
      });

      this.isDialog = false;
    },
    async getResultsVote(voteId, userId) {
      this.voteResults = await httpService.getVoteResult(voteId, userId);
    },
    openResultsVote(vote) {
      this.getResultsVote(vote._id, this.userId);
      this.voteName = vote.name;
      this.questions = vote.questions;
      this.allQuestionsIndexs = vote.questions.length;
      this.currentQuestionIndex = 0;
      this.resultsDialog = true;
    },
    onAcess(name) {
        const snackbar = useSnackbarStore();
        snackbar.show(`You havent access to results for vote: ${name}`);
    }
  }
}
