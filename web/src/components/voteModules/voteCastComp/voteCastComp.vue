<template>
<section class="vote-cast">

  <div v-if="stage == 'first'" class="category" v-for="(cat, index) in category">
      <a :title="cat.title" @click="changeStage(cat.name, index)">
        {{ cat.signature }}
      </a>
  </div>

  <div v-if="stage != 'first'" id="selectVote">
    <Paginator :rows="15" :totalRecords="120" :rowsPerPageOptions="[15, 25, 50]"></Paginator>
    <div>
      <header>
        <h3> {{ selectedCategory.headerTitle }} </h3>
      </header>
      <main>

        <table>
          <tbody>
            <tr>
              <th>NAME</th>
              <th>GIVE VOTE!</th>
              <th>RESULTS IS PUBLIC?</th>
              <th>RESULTS</th>
            </tr>
            <tr v-for="(vote, index) in votes">
              <td>{{vote.name}}</td>
              <td>
              <img src="vote-svgrepo-com.svg" alt="give vote" title="Give vote!" @click="openVote(index)"/>
            </td>
            <td :style="{'background-color': vote.active ? 'green': 'red'}"></td>
            <td v-if="vote.publicResults || vote.userId === userId">
              <img src="look-into-telescope-see-watch-view-svgrepo-com.svg" alt="look results" title="look results" @click="openResultsVote(vote)"/>
            </td>
            <td v-else>
              <img src="no-access-svgrepo-com.svg" alt="you havent access" title="you havent access" @click="onAcess(vote.name)"/>
            </td>
            </tr>
          </tbody>
        </table>

        <Dialog v-model:visible="isDialog" modal header="GIVE YOUR OPINION" :style="{ width: '25rem' }"> 
          <h2 v-if="votes[selectVoteIndex]"> {{ votes[selectVoteIndex].name }} </h2>
          <div id="questions" v-if="votes[selectVoteIndex]">
            <div>
              <p> Question: {{ currentQuestionIndex + 1 }} of  {{ allQuestionsIndexs }} </p>
              <button @click="previousQuestion">
                <img src="arrow-left-svgrepo-com.svg" />
              </button>
              <button @click="nextQuestion">
                <img src="arrow-right-svgrepo-com.svg"/>
              </button>
            </div>
            <h4> {{ votes[selectVoteIndex].questions[currentQuestionIndex].name }} </h4>
            <div v-for="q in votes[selectVoteIndex].questions[currentQuestionIndex].answers" :key="q">
              <input type="radio" v-model="answer" class="radioType" @change="saveAnswer" :value="q">
              {{q}}
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button label="SAVE AND CLOUSE" @click="saveVoteResult" class="btn-submit"></Button>
            <Button label="BACK" @click="isDialog = false"></Button>
          </div>
        </Dialog>

        <Dialog v-model:visible="resultsDialog" modal header="VOTE RESULTS" :style="{ width: '25rem' }"> 
          <h2> {{ voteName }} </h2>
          <div id="questions">
            <div>
              <p> Question: {{ currentQuestionIndex + 1 }} of  {{ allQuestionsIndexs }} </p>
              <button @click="previousQuestion">
                <img src="arrow-left-svgrepo-com.svg" />
              </button>
              <button @click="nextQuestion">
                <img src="arrow-right-svgrepo-com.svg"/>
              </button>
            </div>
            <h4 v-if="questions[currentQuestionIndex]"> {{ questions[currentQuestionIndex].name }} </h4>
            <div v-for="results in voteResults?.results" :key="results.answerName">
              <div v-if="questions[currentQuestionIndex] && results.questionName == questions[currentQuestionIndex].name">
                {{ results.answerName }} all votes: {{ results.quantity }}
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <Button label="BACK" @click="resultsDialog = false"></Button>
          </div>
        </Dialog>

      </main>
    </div>
  </div>
</section>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Paginator from 'primevue/paginator';

import httpService from '@/services/http.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'VoteCastComp',
  components: {
    Dialog,
    Button,
    InputText,
    Paginator,
  },
  data () {
    return {
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
          active: 'true',
          name: 'OnlyActiveVotes',
          title: 'You can see only votes where you can give vote',
          signature: 'Active votes',
          headerTitle: 'Voting in progress!',
        }, {
          active: 'false',
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
  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.userId;
    },
    session() {
      const authStore = useAuthStore();
      return authStore.session;
    }
  },
  methods: {
    changeStage(newStage, idx) {
      this.stage = newStage;
      this.selectedCategory = this.category[idx];

      this.checkSessionAndInitData();
    },
    async getVoteSession() {
      try {
        const response = await httpService.get(`/vote/getVotes/${this.selectedCategory.active}`);
        this.votes = this.checkActiveVoteStatus(response.data);
      } catch (error) {
        console.error('Failed to get votes with session', error);
      }
    },
    checkActiveVote(expiryDate) {
      return new Date(expiryDate) - new Date() < 0 ? false : true;
    },
    async getVoteNoSession() {
      try {
        const response = await httpService.get(`/vote/getVotesNoSession/${this.selectedCategory.active}`);
        this.votes = this.checkActiveVoteStatus(response.data);
      } catch (error) {
        console.error('Failed to get votes without session', error);
      }
    },
    checkActiveVoteStatus(data) {
      if (!data) return [];
      data.forEach(element => {
        element.active = this.checkActiveVote(element.expiryDate);
      });
      return data;
    },
    checkSessionAndInitData() {
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
      this.currentQuestionIndex = 0;
      this.answers = [];
      this.answer = '';
    },
    saveAnswer() {
      this.answers[this.currentQuestionIndex] = this.answer;
    },
    nextQuestion() {
      if( this.currentQuestionIndex >= this.allQuestionsIndexs - 1 ) {
        return;
      }
      this.currentQuestionIndex++;
      this.answer = this.answers[this.currentQuestionIndex] || '';
    },
    previousQuestion() {
      if ( this.currentQuestionIndex <= 0 )
        return;
      this.currentQuestionIndex--;
      this.answer = this.answers[this.currentQuestionIndex] || '';
    },
    async saveVoteResult() {
      try {
        await httpService.post('/vote/saveVoteCast', {
          answers: this.answers,
          voteId: this.votes[this.selectVoteIndex]._id,
          userId: this.userId,
        });
        this.isDialog = false;
      } catch (error) {
        console.error('Failed to save vote result', error);
      }
    },
    async getResultsVote(voteId, userId) {
      try {
        const response = await httpService.get(`/vote/voteResults/${voteId}/${userId}`);
        this.voteResults = response.data;
      } catch (error) {
        console.error('Failed to get vote results', error);
      }
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
</script>

<style scoped lang="scss">
.vote-cast {
    width: 100%;
    color: var(--body-text);
    padding: 1rem;
}

.vote-item-link {
    margin: 1rem auto;
    padding: 2rem;
    background-color: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    color: var(--body-text);
    width: 100%;
    max-width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: var(--card-shadow);
}

.vote-item-link:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    border-color: var(--primary-color);
}

.category {
    margin: 1.5rem auto;
    width: 100%;
    max-width: 500px;

    a {
        display: block;
        padding: 2.5rem 1.5rem;
        background: linear-gradient(135deg, var(--card-bg) 0%, var(--body-bg) 100%);
        border: 2px solid var(--card-border);
        border-radius: 20px;
        color: var(--body-text);
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: var(--card-shadow);
        cursor: pointer;

        &:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--primary-color);
            background: var(--card-bg);
            box-shadow: 0 25px 30px -10px rgba(0, 0, 0, 0.15);
            color: var(--primary-color);
        }

        &:active {
            transform: translateY(-2px) scale(1);
        }
    }
}

#selectVote {
    margin-top: 2rem;
}

header {
    margin-bottom: 1.5rem;
}

input {
    margin-bottom: 1rem;
}

#Questions {
    margin: 2rem 0;
}
</style>
