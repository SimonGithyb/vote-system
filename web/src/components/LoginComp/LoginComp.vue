<template>
<section class="login-container">

  <h2>LOGIN</h2>

  <form @submit.prevent="handleSubmit">
    
    <div class="field">
      <label>Email</label>
      <input type="email" required v-model="email" placeholder="Enter your email"/>
    </div>

    <div class="field">
      <label>Password</label>
      <div class="password-input">
        <input :type="passFieldType" required v-model="password" placeholder="Enter your password"/>
        <button type="button" @click="obfuscateToggle()" class="eye-btn">
          <img :src="`/${eyeSvg}.svg`" width="25px" height="25px" :alt="eyeSvg"/>
        </button>
      </div>
    </div>

    <div class="submit">
      <button type="submit">Log In</button>
    </div>

  </form>
</section>
</template>

<script>
import httpService from '@/services/http.service';
import { useSnackbarStore } from '@/stores/snackbar';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'LoginComp',
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
      const snackbar = useSnackbarStore();
      const auth = useAuthStore();
      try {
        const response = await httpService.post('auth/login', {
          email: this.email,
          password: this.password
        });
        
        if (response.data?.accessToken) {
          auth.login(response.data);
          snackbar.show("Login successful!", {type: 'success'});
          this.$router.push('/');
        }
      } catch (error) {
        snackbar.show(error.response?.data?.message || "Login failed", {type: 'error'});
      }
    },
    obfuscateToggle() {
      this.eyeSvg = this.eyeSvg === "close-eye" ? "eye" : "close-eye";
      this.passFieldType = this.passFieldType === "password" ? "text" : "password";
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid var(--card-border);
  border-radius: 12px;
  background: var(--card-bg);

  .field {
    margin-bottom: 1.5rem;
    text-align: left;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--body-text);
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1.5px solid var(--input-border);
      border-radius: 8px;
      background-color: var(--input-bg);
      color: var(--body-text);
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--input-focus);
      }
    }
  }

  .password-input {
    position: relative;
    display: flex;
    align-items: center;

    .eye-btn {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }
  }

  .submit {
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 700;
      transition: all 0.2s ease;

      &:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
      }
    }
  }
}
</style>
