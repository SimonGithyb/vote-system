import axios from 'axios';

import config from '@/config';

export default {
  name: 'login-comp',
  components: {},
  props: [],
  data() {
    return {
      email: '',
      password: '',
      snackbar: false,
      snackMessage: '',
    }
  },
  methods: {
    async handleSubmit() {
      const url = `${config.API_URL}/auth/login`;
      url.replace(/[\u200B-\u200D\uFEFF]/g, '');
      await axios.post(url, {
            email: this.email,
            password: this.password,
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
}


