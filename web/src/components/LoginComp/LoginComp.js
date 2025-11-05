import axios from 'axios';

import config from '@/config';

export default {
  name: 'login-comp',
  components: {},
  props: [],
  data () {
    return {
      email: '',
      password: '',
      snackbar: false,
      snackMessage: '',
      passFieldType: 'password',
      eyeSvg: 'close-eye',
    }
  },
  methods: {
    async handleSubmit() {
      // const url = `${config.API_URL}/auth/login`;
      await axios.post(`${config.API_URL}/auth/login`, {
            email: this.email,
            password: this.password,
        },
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => {
          if ( res.data.error) {
            this.snackMessage = res.data.errorDetails.message;
            this.snackbar = true;
            return;
          }
          this.snackMessage = res.data.message;
          this.snackbar = true;
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.RefreshToken);
          localStorage.setItem('session', true);
          location.reload();
          return;
        })
        .catch(err => {
          console.error(err);

          this.snackMessage =  err.response.data.errorDetails.message;
          this.snackbar = true;
        });
    },
    obfuscateToggle() {
      if (this.eyeSvg === "close-eye") {
          this.eyeSvg = "eye";
      } else {
          this.eyeSvg = "close-eye";
      }

      if (this.passFieldType == "password") {
          this.passFieldType = "text";
      } else {
          this.passFieldType = "password";
      }
    }
  }
}


