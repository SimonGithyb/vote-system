import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

import httpService from '@/services/http.service';
import { useSnackbarStore } from '@/stores/snackbar';

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
      votes: [],
      lastRecordId: 0,
      paginatorRowsPerPageOptions: [ 10, 25, 50 ],
      paginatorCurrentRow: 10,
      paginatorTotalRecords: 0,
      paginatorSideNumber: 1,
      publicResults: true,
      resultsDialog: false,
      voteResults: [],
      currentQuestionIndex: 0,
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
        const snackbar = useSnackbarStore();
        snackbar.show('Cant create more answer that 10');
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
        const snackbar = useSnackbarStore();
        snackbar.show('Cant create more question that 10');
        return;
      }
      this.questions[questionIndex].answerQuentity++;
    },
    async createNewVote() {
      await httpService.createNewVote({
        voteName: this.voteName,
        voteType: this.voteType,
        questions: this.questions,
        userId: this.userId,
        voteExpiry: this.voteExpiry,
        publicResults: this.publicResults,
      });
    },  
    async getVotes() {
      const votes = await httpService.getVotes(this.userId, this.lastRecordId, this.paginatorCurrentRow);
      this.addVotesToArray(votes);
      this.lastRecordId = this.getLastIdFormVotesArray();
    },
    async getAllVotesSize() {
      this.paginatorTotalRecords = await httpService.getVoteSize(this.userId);
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
      return this?.votes[lastIndex]?._id;
    },
    checkActiveVote(expiryDate) {
      return expiryDate - new Date() < 0 ? false : true;
    },
    async deleteVote(id, index) {
      this.deleteFormVotesArray(index);
      await httpService.deleteVote(id);
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
      await httpService.saveEditVote(this.voteId, {
        voteName: this.voteName,
        voteType: this.voteType,
        questions: this.questions,
        userId: this.userId,
        voteExpiry: this.voteExpiry,
      })
      this.editInVoteArray(this.editedVoteIndex);
      this.clearVoteFieldsAfterEdit();
      this.changeStage('allCreatedVotes');
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
      this.voteResults = await httpService.getVoteResult(id, this.userId);
    },
    nextQuestion() {
      if( this.currentQuestionIndex >= this.questionQuentity - 1 ) {
        return;
      }
      this.currentQuestionIndex++;
    },
    previousQuestion() {
      if ( this.currentQuestionIndex <= 0 )
        return;
      this.currentQuestionIndex--;
    },
    openResultsVote(vote) {
      this.getResultsVote(vote._id);
      this.voteName = vote.name;
      this.questions = vote.questions;
      this.questionQuentity = vote.questions.length;
      this.currentQuestionIndex = 0;
      this.resultsDialog = true;
    },
  },
};
