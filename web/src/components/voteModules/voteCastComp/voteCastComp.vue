<template>
<section class="vote-cast">

  <div v-if="stage == 'first'">
    <div v-for="(cat, index) in category" :key="cat.name" class="category">
        <a :title="cat.title" @click="changeStage(cat.name, index)">
          {{ cat.signature }}
        </a>
    </div>
  </div>

  <div v-if="stage != 'first'" id="selectVote">
    <Paginator :rows="15" :totalRecords="120" :rowsPerPageOptions="[15, 25, 50]"></Paginator>
    <div>
      <header>
        <h3> {{ selectedCategory.headerTitle }} </h3>
      </header>
      <main>

        <table class="stage-table">
          <tbody>
            <tr>
              <th>NAME</th>
              <th>VOTE</th>
              <th>STATUS</th>
              <th>RESULTS</th>
            </tr>
            <tr v-for="(vote, index) in votes" :key="vote._id">
              <td>{{vote.name}}</td>
              <td>
                <img src="vote-svgrepo-com.svg" alt="give vote" title="Give vote!" @click="openVote(index)" class="action-icon" width="24" height="24" style="width: 24px; height: 24px;"/>
              </td>
              <td>
                <span :style="{
                  'color': 'white',
                  'background-color': vote.active ? 'var(--success-color)' : 'var(--danger-color)',
                  'padding': '4px 8px',
                  'border-radius': '12px',
                  'font-size': '0.75rem',
                  'font-weight': 'bold'
                }">
                  {{ vote.active ? 'ACTIVE' : 'ENDED' }}
                </span>
              </td>
              <td>
                <div v-if="vote.publicResults || vote.userId === userId">
                  <img src="look-into-telescope-see-watch-view-svgrepo-com.svg" alt="look results" title="Look results" @click="openResultsVote(vote)" class="action-icon" width="24" height="24" style="width: 24px; height: 24px;"/>
                </div>
                <div v-else>
                  <img src="no-access-svgrepo-com.svg" alt="no access" title="Results are private" @click="onAcess(vote.name)" class="action-icon" width="24" height="24" style="width: 24px; height: 24px; opacity: 0.5;"/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <Dialog v-model:visible="isDialog" modal header="GIVE YOUR OPINION" :style="{ width: '30rem' }"> 
          <h2 v-if="votes[selectVoteIndex]" style="text-align: center;"> {{ votes[selectVoteIndex].name }} </h2>
          <div id="questions" v-if="votes[selectVoteIndex]">
            <div class="navigation-controls">
              <button @click="previousQuestion" class="nav-btn" :disabled="currentQuestionIndex === 0">
                <img src="arrow-left-svgrepo-com.svg" width="20" height="20" style="width: 20px; height: 20px;"/>
              </button>
              <p class="question-progress"> Question: {{ currentQuestionIndex + 1 }} of {{ allQuestionsIndexs }} </p>
              <button @click="nextQuestion" class="nav-btn" :disabled="currentQuestionIndex === allQuestionsIndexs - 1">
                <img src="arrow-right-svgrepo-com.svg" width="20" height="20" style="width: 20px; height: 20px;"/>
              </button>
            </div>
            
            <h4 style="margin: 1rem 0;"> {{ votes[selectVoteIndex].questions[currentQuestionIndex].name }} </h4>
            
            <div class="answers-list">
              <label v-for="q in votes[selectVoteIndex].questions[currentQuestionIndex].answers" :key="q" class="answer-option">
                <input type="radio" v-model="answer" class="radioType" @change="saveAnswer" :value="q" style="width: auto; margin: 0;">
                <span>{{q}}</span>
              </label>
            </div>
          </div>
          <div class="flex justify-center gap-4" style="margin-top: 2rem;">
            <Button label="SAVE AND CLOSE" @click="saveVoteResult" class="btn-submit" style="margin: 0; width: auto;"></Button>
            <Button label="BACK" @click="isDialog = false" class="p-button-secondary"></Button>
          </div>
        </Dialog>

        <Dialog v-model:visible="resultsDialog" modal header="VOTE RESULTS" :style="{ width: '30rem' }"> 
          <h2 style="text-align: center;"> {{ voteName }} </h2>
          <div id="questions">
            <div class="navigation-controls">
              <button @click="previousQuestion" class="nav-btn" :disabled="currentQuestionIndex === 0">
                <img src="arrow-left-svgrepo-com.svg" width="20" height="20" style="width: 20px; height: 20px;"/>
              </button>
              <p class="question-progress"> Question: {{ currentQuestionIndex + 1 }} of {{ allQuestionsIndexs }} </p>
              <button @click="nextQuestion" class="nav-btn" :disabled="currentQuestionIndex === allQuestionsIndexs - 1">
                <img src="arrow-right-svgrepo-com.svg" width="20" height="20" style="width: 20px; height: 20px;"/>
              </button>
            </div>

            <h4 v-if="questions[currentQuestionIndex]" style="margin: 1rem 0;"> {{ questions[currentQuestionIndex].name }} </h4>
            
            <div class="answers-list" style="align-items: stretch; width: 100%;">
              <div v-for="results in voteResults?.results" :key="results.answerName" style="width: 100%;">
                <div v-if="questions[currentQuestionIndex] && results.questionName == questions[currentQuestionIndex].name" 
                     style="display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid var(--card-border);">
                  <span style="font-weight: 500;">{{ results.answerName }}</span>
                  <span class="badge">{{ results.quantity }} votes</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center" style="margin-top: 2rem;">
            <Button label="BACK" @click="resultsDialog = false" class="p-button-secondary"></Button>
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
import Paginator from 'primevue/paginator';

import httpService from '@/services/http.service';
import socketService from '@/services/socket.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'VoteCastComp',
  components: {
    Dialog,
    Button,
    Paginator,
  },
  mounted() {
    socketService.on('voteUpdated', (data) => {
      if (this.resultsDialog && this.voteResults?.voteId === data.voteId) {
        this.getResultsVote(data.voteId, this.userId);
      }
    });
    socketService.on('voteCreated', () => {
      if (this.stage !== 'first') {
        this.checkSessionAndInitData();
      }
    });
  },
  unmounted() {
    socketService.off('voteUpdated');
    socketService.off('voteCreated');
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

#questions {
    margin: 1.5rem 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.navigation-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
    width: 100%;
}

.nav-btn {
    background: transparent;
    border: 1px solid var(--card-border);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        img {
            filter: brightness(0) invert(1);
        }
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
}

.question-progress {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--footer-text);
    margin: 0;
}

.answers-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 1rem 0;
    width: fit-content;
}

.answer-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 1.1rem;
}

.stage-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background: var(--card-bg);
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

.action-icon {
    width: 24px !important;
    height: 24px !important;
    max-width: 24px !important;
    max-height: 24px !important;
    cursor: pointer;
    transition: transform 0.2s ease;
    vertical-align: middle;
    display: inline-block;
}

.action-icon:hover {
    transform: scale(1.1);
}
</style>
