<template>
<section class="vote-module">
  <nav class="module-nav">
    <a @click="setStage('browse')" :class="{ active: currentTab === 'browse' }">Browse Votes</a>
    <a @click="setStage('my-votes')" :class="{ active: currentTab === 'my-votes' }" v-if="accessToken">My Votes</a>
    <a @click="setStage('create')" :class="{ active: currentTab === 'create' }" v-if="accessToken">Create New</a>
  </nav>

  <main class="main-content card">
    <!-- STAGE: CATEGORY SELECTION (for Browse) -->
    <div v-if="stage === 'browse-categories'" class="category-grid">
      <div v-for="(cat, index) in categories" :key="cat.name" class="category-card" @click="loadCategory(index)">
        <h3>{{ cat.signature }}</h3>
        <p>{{ cat.title }}</p>
      </div>
    </div>

    <!-- STAGE: VOTE LIST (Shared for Browse and My Votes) -->
    <div v-else-if="stage === 'list'" class="list-container">
      <div class="list-header">
        <button class="btn-back" @click="goBack" v-if="currentTab === 'browse'">← Back to categories</button>
        <h2>{{ listTitle }}</h2>
      </div>

      <Paginator 
        :rows="paginatorRows" 
        :totalRecords="totalRecords" 
        :rowsPerPageOptions="[10, 20, 50]"
        @page="onPageChange"
      ></Paginator>

      <div class="table-responsive">
        <table class="stage-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>STATUS</th>
              <th v-if="currentTab === 'browse'">ACTION</th>
              <th v-if="currentTab === 'my-votes'">EDIT</th>
              <th v-if="currentTab === 'my-votes'">DELETE</th>
              <th>RESULTS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vote, index) in votes" :key="vote._id">
              <td class="font-medium">{{ vote.name }}</td>
              <td>
                <span class="status-badge" :class="vote.active ? 'active' : 'ended'">
                  {{ vote.active ? 'ACTIVE' : 'ENDED' }}
                </span>
              </td>
              <!-- BROWSE ACTIONS -->
              <td v-if="currentTab === 'browse'">
                <img src="vote-svgrepo-com.svg" class="action-icon" width="24" height="24" 
                     @click="openVoteDialog(vote, index)" title="Vote now" />
              </td>
              <!-- MY VOTES ACTIONS -->
              <td v-if="currentTab === 'my-votes'">
                <img src="edit_icon.svg" class="action-icon" width="24" height="24" 
                     @click="prepareEdit(vote, index)" title="Edit" />
              </td>
              <td v-if="currentTab === 'my-votes'">
                <img src="delete_icon.svg" class="action-icon" width="24" height="24" 
                     @click="deleteVote(vote._id, index)" title="Delete" />
              </td>
              <!-- RESULTS (Common) -->
              <td>
                <div v-if="vote.publicResults || vote.userId === userId">
                  <img src="look-into-telescope-see-watch-view-svgrepo-com.svg" class="action-icon" 
                       width="24" height="24" @click="openResults(vote)" title="View Results" />
                </div>
                <div v-else>
                  <img src="no-access-svgrepo-com.svg" class="action-icon disabled" 
                       width="24" height="24" @click="showNoAccess(vote.name)" title="Private Results" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- STAGE: CREATE / EDIT FORM -->
    <div v-else-if="stage === 'form'" class="form-container">
      <h2>{{ editMode ? 'EDIT VOTE' : 'CREATE NEW VOTE' }}</h2>
      <form @submit.prevent="saveVote" class="unified-form">
        <div class="form-group">
          <label>Vote Name</label>
          <InputText v-model="form.name" required placeholder="Enter vote title..." />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Expiry Date</label>
            <input type="datetime-local" v-model="form.expiry" required />
          </div>
          <div class="form-group">
            <label>Privacy</label>
            <div class="radio-group">
              <label><input type="radio" v-model="form.type" value="public" /> Public</label>
              <label><input type="radio" v-model="form.type" value="private" /> Private</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Results Visibility</label>
          <div class="radio-group">
            <label><input type="radio" v-model="form.publicResults" :value="true" /> Public</label>
            <label><input type="radio" v-model="form.publicResults" :value="false" /> Private</label>
          </div>
        </div>

        <div class="questions-section">
          <div class="section-header">
            <h3>Questions ({{ form.questions.length }}/10)</h3>
            <Button label="Add Question" icon="pi pi-plus" @click="addQuestion" :disabled="form.questions.length >= 10" />
          </div>

          <div v-for="(q, qIdx) in form.questions" :key="qIdx" class="question-card">
            <div class="q-header">
              <InputText v-model="q.name" placeholder="Question text..." required />
              <Button icon="pi pi-trash" severity="danger" text @click="removeQuestion(qIdx)" v-if="form.questions.length > 1" />
            </div>
            
            <div class="answers-management">
              <p>Answers ({{ q.answers.length }}/10):</p>
              <div class="answers-grid">
                <div v-for="(ans, aIdx) in q.answers" :key="aIdx" class="answer-input">
                  <InputText v-model="q.answers[aIdx]" placeholder="Answer..." required />
                  <Button icon="pi pi-times" severity="secondary" text @click="removeAnswer(qIdx, aIdx)" v-if="q.answers.length > 2" />
                </div>
                <Button label="+" @click="addAnswer(qIdx)" v-if="q.answers.length < 10" severity="secondary" outlined />
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <Button label="SAVE VOTE" type="submit" class="btn-submit" />
          <Button label="CANCEL" @click="setStage(currentTab)" severity="secondary" text />
        </div>
      </form>
    </div>
  </main>

  <!-- DIALOG: CAST VOTE -->
  <Dialog v-model:visible="isVoteDialog" modal header="CAST YOUR VOTE" :style="{ width: '35rem' }">
    <div v-if="selectedVote" class="vote-workflow">
      <h2 class="text-center">{{ selectedVote.name }}</h2>
      <div class="voting-container">
        <div class="navigation-controls">
          <button @click="prevQ" class="nav-btn" :disabled="curQIdx === 0">
            <img src="arrow-left-svgrepo-com.svg" width="20" height="20" />
          </button>
          <span class="progress-label">Question {{ curQIdx + 1 }} of {{ selectedVote.questions.length }}</span>
          <button @click="nextQ" class="nav-btn" :disabled="curQIdx === selectedVote.questions.length - 1">
            <img src="arrow-right-svgrepo-com.svg" width="20" height="20" />
          </button>
        </div>

        <div class="current-question">
          <h4>{{ selectedVote.questions[curQIdx].name }}</h4>
          <div class="answers-list">
            <label v-for="ans in selectedVote.questions[curQIdx].answers" :key="ans" class="answer-option">
              <input type="radio" v-model="userAnswers[curQIdx]" :value="ans" />
              <span>{{ ans }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="flex justify-center gap-4 mt-8">
        <Button label="SUBMIT VOTE" @click="submitVote" severity="success" :disabled="!isVoteComplete" />
        <Button label="CLOSE" @click="isVoteDialog = false" severity="secondary" text />
      </div>
    </div>
  </Dialog>

  <!-- DIALOG: RESULTS -->
  <Dialog v-model:visible="isResultsDialog" modal header="VOTE RESULTS" :style="{ width: '35rem' }">
    <div v-if="resultsData" class="results-workflow">
      <h2 class="text-center">{{ resultsData.voteName }}</h2>
      <div class="navigation-controls">
        <button @click="prevResultQ" class="nav-btn" :disabled="curResultQIdx === 0">
          <img src="arrow-left-svgrepo-com.svg" width="20" height="20" />
        </button>
        <span class="progress-label">Results for Question {{ curResultQIdx + 1 }}</span>
        <button @click="nextResultQ" class="nav-btn" :disabled="curResultQIdx === resultsQuestions.length - 1">
          <img src="arrow-right-svgrepo-com.svg" width="20" height="20" />
        </button>
      </div>

      <div class="results-container">
        <h4>{{ resultsQuestions[curResultQIdx]?.name }}</h4>
        <div class="results-list">
          <div v-for="res in filteredResults" :key="res.answerName" class="result-row">
            <span class="ans-name">{{ res.answerName }}</span>
            <div class="ans-stats">
              <span class="ans-count">{{ res.quantity }} votes</span>
              <div class="ans-bar-bg">
                <div class="ans-bar-fill" :style="{ width: getPercentage(res.quantity) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-8">
        <Button label="CLOSE" @click="isResultsDialog = false" severity="secondary" />
      </div>
    </div>
  </Dialog>
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
  name: 'VoteModule',
  components: { Dialog, Button, InputText, Paginator },
  data() {
    return {
      currentTab: 'browse', // 'browse', 'my-votes', 'create'
      stage: 'browse-categories', // 'browse-categories', 'list', 'form'
      editMode: false,
      editId: null,

      votes: [],
      totalRecords: 0,
      paginatorRows: 10,
      currentPage: 0,

      // Form Data
      form: {
        name: '',
        type: 'public',
        expiry: '',
        publicResults: true,
        questions: [{ name: '', answers: ['', ''] }]
      },

      // Voting
      selectedVote: null,
      isVoteDialog: false,
      curQIdx: 0,
      userAnswers: [],

      // Results
      isResultsDialog: false,
      resultsData: null,
      resultsQuestions: [],
      curResultQIdx: 0,

      categories: [
        { name: 'all', signature: 'All Votes', title: 'See everything', active: 'all' },
        { name: 'active', signature: 'Active', title: 'Voting in progress', active: 'true' },
        { name: 'ended', signature: 'Ended', title: 'Finished votes', active: 'false' }
      ],
      selectedCatIdx: 0
    };
  },
  computed: {
    authStore() { return useAuthStore(); },
    userId() { return this.authStore.userId; },
    accessToken() { return this.authStore.accessToken; },
    listTitle() {
      if (this.currentTab === 'my-votes') return 'My Created Votes';
      return this.categories[this.selectedCatIdx].headerTitle || this.categories[this.selectedCatIdx].signature;
    },
    isVoteComplete() {
      if (!this.selectedVote) return false;
      return this.userAnswers.length === this.selectedVote.questions.length && 
             this.userAnswers.every(a => a !== undefined && a !== '');
    },
    filteredResults() {
      if (!this.resultsData || !this.resultsQuestions[this.curResultQIdx]) return [];
      const qName = this.resultsQuestions[this.curResultQIdx].name;
      return this.resultsData.results.filter(r => r.questionName === qName);
    }
  },
  mounted() {
    this.initFromRoute();
    socketService.on('voteUpdated', (data) => {
      if (this.isResultsDialog && this.resultsData?.voteId === data.voteId) {
        this.fetchResults(data.voteId);
      }
    });
    socketService.on('voteCreated', () => {
      if (this.stage === 'list' && this.currentTab === 'browse') {
        this.fetchVotes();
      }
    });
  },
  unmounted() {
    socketService.off('voteUpdated');
    socketService.off('voteCreated');
  },
  methods: {
    initFromRoute() {
      if (this.$route.path === '/createVotes') {
        this.setStage('my-votes');
      } else {
        this.setStage('browse');
      }
    },
    setStage(tab) {
      this.currentTab = tab;
      this.editMode = false;
      this.votes = [];
      this.currentPage = 0;

      if (tab === 'browse') {
        this.stage = 'browse-categories';
      } else if (tab === 'my-votes') {
        this.stage = 'list';
        this.fetchMyVotes();
      } else if (tab === 'create') {
        this.stage = 'form';
        this.resetForm();
      }
    },
    loadCategory(idx) {
      this.selectedCatIdx = idx;
      this.stage = 'list';
      this.fetchVotes();
    },
    goBack() {
      this.stage = 'browse-categories';
    },
    async fetchVotes() {
      try {
        const cat = this.categories[this.selectedCatIdx];
        const endpoint = this.accessToken ? `/vote/getVotes/${cat.active}` : `/vote/getVotesNoSession/${cat.active}`;
        const res = await httpService.get(endpoint);
        this.votes = res.data.map(v => ({ ...v, active: this.isVoteActive(v.expiryDate) }));
        this.totalRecords = this.votes.length;
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMyVotes() {
      try {
        const size = this.paginatorRows;
        const res = await httpService.get(`/vote/getVote/${this.userId}/0/${size}`);
        this.votes = res.data.map(v => ({ ...v, active: this.isVoteActive(v.expiryDate) }));
        const sizeRes = await httpService.get(`/vote/getVoteSize/${this.userId}`);
        this.totalRecords = sizeRes.data;
      } catch (err) {
        console.error(err);
      }
    },
    isVoteActive(expiry) {
      return new Date(expiry) > new Date();
    },
    onPageChange(e) {
      this.paginatorRows = e.rows;
      this.currentPage = e.page;
      this.currentTab === 'my-votes' ? this.fetchMyVotes() : this.fetchVotes();
    },

    // Form Methods
    resetForm() {
      this.form = {
        name: '', type: 'public', expiry: '', publicResults: true,
        questions: [{ name: '', answers: ['', ''] }]
      };
      this.editMode = false;
    },
    addQuestion() {
      if (this.form.questions.length < 10) {
        this.form.questions.push({ name: '', answers: ['', ''] });
      }
    },
    removeQuestion(idx) {
      this.form.questions.splice(idx, 1);
    },
    addAnswer(qIdx) {
      if (this.form.questions[qIdx].answers.length < 10) {
        this.form.questions[qIdx].answers.push('');
      }
    },
    removeAnswer(qIdx, aIdx) {
      this.form.questions[qIdx].answers.splice(aIdx, 1);
    },
    prepareEdit(vote) {
      this.editMode = true;
      this.editId = vote._id;
      this.form = {
        name: vote.name,
        type: vote.type,
        expiry: new Date(vote.expiryDate).toISOString().slice(0, 16),
        publicResults: vote.publicResults,
        questions: JSON.parse(JSON.stringify(vote.questions))
      };
      this.stage = 'form';
    },
    async saveVote() {
      try {
        const payload = {
          voteName: this.form.name,
          voteType: this.form.type,
          voteExpiry: this.form.expiry,
          publicResults: this.form.publicResults,
          questions: this.form.questions.map(q => ({
            name: q.name,
            answers: q.answers.filter(a => a.trim() !== '')
          }))
        };

        if (this.editMode) {
          await httpService.put(`/vote/${this.editId}`, payload);
        } else {
          await httpService.post('/vote', payload);
        }
        
        const snackbar = useSnackbarStore();
        snackbar.show(this.editMode ? 'Vote updated!' : 'Vote created!', { type: 'success' });
        this.setStage('my-votes');
      } catch (err) {
        console.error(err);
      }
    },
    async deleteVote(id) {
      try {
        await httpService.delete(`/vote/${id}`);
        this.fetchMyVotes();
      } catch (err) {
        console.error(err);
      }
    },

    // Voting Methods
    openVoteDialog(vote) {
      if (!vote.active) {
        useSnackbarStore().show('This vote has ended!', { type: 'error' });
        return;
      }
      this.selectedVote = vote;
      this.userAnswers = new Array(vote.questions.length).fill('');
      this.curQIdx = 0;
      this.isVoteDialog = true;
    },
    nextQ() { if (this.curQIdx < this.selectedVote.questions.length - 1) this.curQIdx++; },
    prevQ() { if (this.curQIdx > 0) this.curQIdx--; },
    async submitVote() {
      try {
        await httpService.post('/vote/saveVoteCast', {
          voteId: this.selectedVote._id,
          answers: this.userAnswers
        });
        this.isVoteDialog = false;
        useSnackbarStore().show('Vote submitted successfully!', { type: 'success' });
      } catch (err) {
        console.error(err);
      }
    },

    // Results Methods
    async openResults(vote) {
      this.resultsQuestions = vote.questions;
      this.curResultQIdx = 0;
      await this.fetchResults(vote._id);
      this.isResultsDialog = true;
    },
    async fetchResults(voteId) {
      try {
        const res = await httpService.get(`/vote/voteResults/${voteId}/${this.userId || 'null'}`);
        this.resultsData = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    nextResultQ() { if (this.curResultQIdx < this.resultsQuestions.length - 1) this.curResultQIdx++; },
    prevResultQ() { if (this.curResultQIdx > 0) this.curResultQIdx--; },
    getPercentage(quantity) {
      if (!this.resultsData) return 0;
      const totalInQ = this.filteredResults.reduce((acc, r) => acc + r.quantity, 0);
      return totalInQ === 0 ? 0 : Math.round((quantity / totalInQ) * 100);
    },
    showNoAccess(name) {
      useSnackbarStore().show(`Results for "${name}" are private.`, { type: 'error' });
    }
  }
};
</script>

<style scoped lang="scss">
.vote-module {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.module-nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  a {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--body-text);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0.6;

    &:hover, &.active {
      opacity: 1;
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.category-card {
  padding: 2.5rem 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--card-shadow);

  h3 { color: var(--primary-color); margin-bottom: 0.5rem; }
  p { font-size: 0.9rem; opacity: 0.7; }

  &:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
}

.list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  .btn-back {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
  }
  h2 { margin: 0; flex: 1; text-align: left; }
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 800;
  color: white;
  &.active { background-color: var(--success-color); }
  &.ended { background-color: var(--danger-color); }
}

.action-icon {
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: scale(1.2); }
  &.disabled { opacity: 0.3; cursor: not-allowed; }
}

/* Form Styles */
.unified-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  text-align: left;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; }
}

.question-card {
  background: rgba(0,0,0,0.02);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--card-border);
}

.q-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  input { flex: 1; }
}

.answers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.answer-input {
  display: flex;
  gap: 0.5rem;
}

/* Dialog Styles */
.navigation-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 1.5rem 0;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--card-border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover:not(:disabled) { border-color: var(--primary-color); }
  &:disabled { opacity: 0.3; }
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem auto;
  width: fit-content;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  input { width: 20px; height: 20px; }
}

.results-list {
  width: 100%;
  margin-top: 1.5rem;
}

.result-row {
  margin-bottom: 1.5rem;
}

.ans-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.ans-count { font-size: 0.8rem; min-width: 60px; }

.ans-bar-bg {
  flex: 1;
  height: 8px;
  background: rgba(0,0,0,0.05);
  border-radius: 4px;
  overflow: hidden;
}

.ans-bar-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.badge {
  background: var(--primary-color);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
}
</style>
