<template>
<section>
  <nav>
    <a @click="changeStage('creator')">Create new vote!</a>
    <a @click="changeStage('allCreatedVotes')" >Check your votes!</a>
  </nav>
  <main>
    <div v-if="stage === 'creator' || stage === 'edit'">
      <h3 v-if="stage === 'creator'">CREATE YOUR NEW VOTE!</h3> 
      <h3 v-if="stage === 'edit'">EDIT YOUR VOTE!</h3> 
      <form @submit.prevent>
        <div class="formFields">
          <label>Vote Name</label>
          <InputText v-model="voteName" required />
        </div>

        <div class="formFields">
          <label>Expiry</label>
          <input type="datetime-local" v-model="voteExpiry" required />
        </div>

        <div>
          <h5>User in this vote is:</h5>

          <div title="Users without accounts can give a vote">
            <input id="voteTypePublic" type="radio" v-model="voteType" value="public" class="radioType" />
            <label for="voteTypePublic" class="radioLabel"> Public </label> 
          </div>

          <div title="Only users with accounts can give a vote">
            <input id="voteTypePrivate" type="radio" v-model="voteType" value="private" class="radioType"/>
            <label for="voteTypePrivate" class="radioLabel">PRIVATE</label>
          </div>
        </div>

        <div>
          <h5>Vote results is:</h5>
          <div title="All can see results">
            <input id="publicResultsTrue" type="radio" v-model="publicResults" :value="true" class="radioType" />
            <label for="publicResultsTrue" class="radioLabel"> Public </label> 
          </div>

          <div title="Only owner and administration can see results">
            <input id="publicResultsFalse" type="radio" v-model="publicResults" :value="false" class="radioType"/>
            <label for="publicResultsFalse" class="radioLabel">PRIVATE</label>
          </div>
        </div>

        <Button label="Add new question" @click="addQuestion" />
        <div>
          <div v-for="(q, index) in questions" :key="index">
            <label>Question {{index + 1}}</label>
            <InputText v-model="q.name" required />
            <h5>Total answers: {{q.answerQuentity}} for question number: {{index + 1}}</h5>
            <div>
              <Button label="Add answer dialog" @click="q.visible = true" />
              <Dialog v-model:visible="q.visible" modal header="Add answers for your question" :style="{ width: '25rem' }"> 
                  <Button label="Add new answer" @click="addAnswer(index)" />
                  <div class="flex items-center gap-4 mb-4"  v-for="inx in q.answerQuentity" :key="inx">
                      <label class="font-semibold w-24">Answer {{inx}}</label>
                      <InputText class="flex-auto" autocomplete="off" v-model="q.answers[inx - 1]" required/>
                  </div>
                  <div class="flex justify-end gap-2">
                    <Button label="BACK" @click="q.visible = false"></Button>
                  </div>
              </Dialog>
              <div>
              </div>
            </div>
          </div>
        </div>
      <Button label="SAVE" @click="createNewVote" v-if="stage === 'creator'" class="btn-submit"/>
      <Button label="SAVE" @click="saveEditVote" v-if="stage === 'edit'" class="btn-submit"/>
      </form>
    </div>

    <div v-else-if="stage == 'allCreatedVotes'">
      <h1> On this page on future you can see all vote what you create and you can it modyfikated or delete </h1>
      <Paginator :rows="paginatorCurrentRow" :totalRecords="paginatorTotalRecords" :rowsPerPageOptions="paginatorRowsPerPageOptions"></Paginator>

      <table class="stage-table">
        <tbody>
          <tr>
            <th>NAME</th>
            <th>EDIT</th>
            <th>DELETE</th>
            <th>ACTIVE</th>
            <th>RESULTS</th>
          </tr>
          <tr v-for="(vote, index) in votes" :key="vote._id">
            <td>{{vote.name}}</td>
            <td>
            <img src="edit_icon.svg" alt="edit" title="edit" @click="editVote(vote, index)" class="action-icon" width="24" height="24"/>
          </td>
            <td>
            <img src="delete_icon.svg" alt="delete" title="delete" @click="deleteVote(vote._id, index)" class="action-icon" width="24" height="24"/>
          </td>
          <td :style="{'background-color': vote.active ? 'green': 'red'}"></td>
          <td>
            <img src="look-into-telescope-see-watch-view-svgrepo-com.svg" alt="look results" title="look results" @click="openResultsVote(vote)" class="action-icon" width="24" height="24"/>
          </td>
          </tr>
        </tbody>
      </table>

    </div>

    <Dialog v-model:visible="resultsDialog" modal header="VOTE RESULTS" :style="{ width: '25rem' }"> 
      <h2> {{ voteName }} </h2>
      <div id="questions">
        <div v-if="questions && questions.length > 0">
          <p> Question: {{ currentQuestionIndex + 1 }} of  {{ questions.length }} </p>
          <button @click="previousQuestion">
            <img src="arrow-left-svgrepo-com.svg" width="24" height="24" style="width: 24px; height: 24px;"/>
          </button>
          <button @click="nextQuestion">
            <img src="arrow-right-svgrepo-com.svg" width="24" height="24" style="width: 24px; height: 24px;"/>
          </button>
        </div>
        <h4 v-if="questions && questions[currentQuestionIndex]"> {{ questions[currentQuestionIndex].name }} </h4>
        <div v-for="results in voteResults.results" :key="results.answerName">
          <div v-if="questions && questions[currentQuestionIndex] && results.questionName == questions[currentQuestionIndex].name">
            {{ results.answerName }} all votes: {{ results.quantity }}
          </div>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        <Button label="BACK" @click="resultsDialog = false"></Button>
      </div>
    </Dialog>

  </main>
</section>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

import httpService from '@/services/http.service';
import socketService from '@/services/socket.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'VoteCreatorComp',
  components: {
    Dialog,
    Button,
    InputText,
    Paginator,
  },
  mounted() {
    socketService.on('voteUpdated', (data) => {
      if (this.resultsDialog && this.voteResults?.voteId === data.voteId) {
        this.getResultsVote(data.voteId);
      }
    });
  },
  unmounted() {
    socketService.off('voteUpdated');
  },
  data () {
    return {
      stage: 'creator',
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
  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.userId;
    },
    accessToken() {
      const authStore = useAuthStore();
      return authStore.accessToken;
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
          visible: false,
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
      try {
        const formattedQuestions = this.questions.map(q => ({
          name: q.name,
          answers: q.answers.filter(a => a && a.trim() !== '') // Usuwamy puste odpowiedzi
        }));

        await httpService.post('/vote', {
          voteName: this.voteName,
          voteType: this.voteType,
          questions: formattedQuestions,
          voteExpiry: this.voteExpiry,
          publicResults: this.publicResults,
        });
        this.changeStage('allCreatedVotes');
      } catch (error) {
        console.error('Failed to create new vote', error);
      }
    },  
    async getVotes() {
      try {
        const response = await httpService.get(`/vote/getVote/${this.userId}/${this.lastRecordId}/${this.paginatorCurrentRow}`);
        this.addVotesToArray(response.data);
        this.lastRecordId = this.getLastIdFormVotesArray();
      } catch (error) {
        console.error('Failed to get votes', error);
      }
    },
    async getAllVotesSize() {
      try {
        const response = await httpService.get(`/vote/getVoteSize/${this.userId}`);
        this.paginatorTotalRecords = response.data;
      } catch (error) {
        console.error('Failed to get vote size', error);
      }
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
      return this?.votes[lastIndex]?._id || 0;
    },
    checkActiveVote(expiryDate) {
      return new Date(expiryDate) - new Date() < 0 ? false : true;
    },
    async deleteVote(id, index) {
      try {
        await httpService.delete(`/vote/${id}`);
        this.deleteFormVotesArray(index);
      } catch (error) {
        console.error('Failed to delete vote', error);
      }
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
      this.publicResults = vote.publicResults;
    },
    msDateToDateTimeFormat(dateInMs) {
      return new Date(dateInMs).toISOString().slice(0, 16);
    },
    async saveEditVote() {
      try {
        const formattedQuestions = this.questions.map(q => ({
          name: q.name,
          answers: q.answers.filter(a => a && a.trim() !== '')
        }));

        await httpService.put(`/vote/${this.voteId}`, {
          voteName: this.voteName,
          voteType: this.voteType,
          questions: formattedQuestions,
          voteExpiry: this.voteExpiry,
          publicResults: this.publicResults,
        });
        this.editInVoteArray(this.editedVoteIndex);
        this.clearVoteFieldsAfterEdit();
        this.changeStage('allCreatedVotes');
      } catch (error) {
        console.error('Failed to save edit vote', error);
      }
    },
    editInVoteArray(index) {
      this.votes[index].name = this.voteName;
      this.votes[index].questions = this.questions;
      this.votes[index].expiryDate = this.voteExpiry;
      this.votes[index].type = this.voteType;
      this.votes[index].publicResults = this.publicResults;
      this.votes[index].active = this.checkActiveVote(this.voteExpiry);
    },
    clearVoteFieldsAfterEdit() {
      this.voteName = '';
      this.questions = [
        {
          name: '',
          visible: false,
          answerQuentity: 0,
          answers: [],
        }
      ];
      this.voteExpiry = '';
      this.voteType = 'private';
      this.questionQuentity = 0;
    },
    async getResultsVote(id) {
      try {
        const response = await httpService.get(`/vote/voteResults/${id}/${this.userId}`);
        this.voteResults = response.data;
      } catch (error) {
        console.error('Failed to get vote results', error);
      }
    },
    nextQuestion() {
      if( this.currentQuestionIndex >= (this.questions ? this.questions.length : 0) - 1 ) {
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
      this.currentQuestionIndex = 0;
      this.resultsDialog = true;
    },
  },
};
</script>

<style scoped lang="scss">
nav {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 20px;
    margin-bottom: 20px;
}

a {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
}

a:hover {
    color: var(--primary-hover);
}

.stage-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.stage-table th, .stage-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--card-border);
}

.stage-table th {
    background-color: rgba(0,0,0,0.02);
    font-weight: 600;
}

.stage-table img.action-icon {
    width: 24px !important;
    height: 24px !important;
    max-width: 24px !important;
    max-height: 24px !important;
    cursor: pointer;
    transition: transform 0.2s ease;
    vertical-align: middle;
    display: inline-block;
}

.stage-table img.action-icon:hover {
    transform: scale(1.1);
}

h5 {
    color: var(--body-text);
}
</style>
