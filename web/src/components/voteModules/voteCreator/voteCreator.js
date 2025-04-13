import config from '@/config';

export default {
  name: 'vote-creator',
  components: {},
  props: [],
  data () {
    return {
      stage: 'creator',
      voteName: '',
      forFuture: false,
      answerQuentity: 1,
      voteType: 'private',
      answers: [],
      snackbar: false,
      snackMessage: '',
    }
  },
  methods: {
    changeStage(newStage) {
      this.stage = newStage;
    },
    addAnswer() {

      if (answerQuentity <= 10) {
        this.snackMessage = 'Cant create more answer that 10';
        this.snackbar = true;
        return;
      }

      this.answerQuentity++;
    },
    async createNewVote() {
      const url = `${config.API_URL}/vote/createNewVote`;
      url.replace(/[\u200B-\u200D\uFEFF]/g, '');
      await axios.post(url, {
            voteName: this.voteName,
            forFuture: this.forFuture,
            voteType: this.voteType,
            answers: this.answers,
        },
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
          this.snackMessage = res.message;
          this.snackbar = true;
          return;
        })
        .catch(err => {
          console.error(err);
          
          this.snackMessage = err.message;
          this.snackbar = true;
        });
    },
  }
};
