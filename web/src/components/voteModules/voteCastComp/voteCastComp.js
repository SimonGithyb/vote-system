import config from '@/config';
import axios from 'axios';

import Paginator from 'primevue/paginator';

const url = config.API_URL;
url.replace(/[\u200B-\u200D\uFEFF]/g, '');

export default {
  name: 'vote-cast',
  components: {
    Paginator,
  },
  data () {
    return {
      accessToken: localStorage.getItem('accessToken'),
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
      votesData: '',
    };
  },
  methods: {
    changeStage(newStage, idx) {
      this.stage = newStage;
      this.selectedCategory = this.category[idx];

      this.getVote();
    },
    async getVote() {
      const voteRage = this.selectedCategory.active;

      await axios.get(`${config.API_URL}/vote/getVote/${voteRage}/${this.session}`, {
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

          this.votesData = res.data.data;
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
    checkSession() {
      this.session = localStorage.getItem('session');

    },
  },
  beforeMount() {
   this.checkSession()
  }
}
