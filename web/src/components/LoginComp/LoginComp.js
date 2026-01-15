import httpService from '@/services/http.service';

export default {
  name: 'login-comp',
  components: {},
  props: [],
  data () {
    return {
      email: '',
      password: '',
      passFieldType: 'password',
      eyeSvg: 'close-eye',
    }
  },
  methods: {
    async handleSubmit() {
      await httpService.login(this.email, this.password);
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


