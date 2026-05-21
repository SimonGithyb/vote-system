<template>
<section class="registration-container">
  <h2>SIGN UP</h2>

  <form @submit.prevent="handleSubmit">
    <div class="field">
      <label>Name:</label>
      <input type="text" placeholder="Your name" v-model="name" required/>
    </div>

    <div class="field">
      <label>Surname:</label>
      <input type="text" placeholder="Your surname" v-model="surname" required/>
    </div>

    <div class="field">
      <label>Email:</label>
      <input type="email" placeholder="Your email" v-model="email" required/>
    </div>

    <div class="field">
      <label>Password:</label>
      <div class="password-input">
        <input :type="passFieldType" placeholder="Password" v-model="password" required />
        <button type="button" @click="togglePass(0)" class="eye-btn">
          <img :src="`/${eyeSvg}.svg`" width="25px" height="25px" />
        </button>
      </div>
      <div class="password-requirements">
        <p :class="requirements.length ? 'valid' : 'invalid'">Minimum 8 characters</p>
        <p :class="requirements.upper ? 'valid' : 'invalid'">At least one uppercase letter</p>
        <p :class="requirements.lower ? 'valid' : 'invalid'">At least one lowercase letter</p>
        <p :class="requirements.number ? 'valid' : 'invalid'">At least one number</p>
      </div>
    </div>

    <div class="field">
      <label>Repeat password:</label>
      <div class="password-input">
        <input :type="pass2FieldType" placeholder="Repeat password" v-model="password2" required/>
        <button type="button" @click="togglePass(1)" class="eye-btn">
          <img :src="`/${eyeSvg2}.svg`" width="25px" height="25px"/>
        </button>
      </div>
      <p v-if="password2 && !passIsSame" class="invalid-text">Passwords do not match</p>
    </div>
    
    <div class="terms">
        <input type="checkbox" v-model="terms" required id="terms-checkbox"/>
        <label for="terms-checkbox">I accept the terms and conditions</label>
    </div>

    <div class="submit">
        <button type="submit" :disabled="!isFormValid">Create an Account</button>
    </div>
  </form>
</section>
</template>

<script>
import httpService from '@/services/http.service';

export default {
    name: 'RegistrationComp',
    data () {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            password2: '',
            passFieldType: 'password',
            pass2FieldType: 'password',
            eyeSvg: 'close-eye',
            eyeSvg2: 'close-eye',
            terms: false,
        }
    },
    computed: {
        requirements() {
            return {
                length: this.password.length >= 8,
                upper: /[A-Z]/.test(this.password),
                lower: /[a-z]/.test(this.password),
                number: /[0-9]/.test(this.password)
            }
        },
        passIsGood() {
            return Object.values(this.requirements).every(v => v);
        },
        passIsSame() {
            return this.password === this.password2;
        },
        isFormValid() {
            return this.name && this.surname && this.email && this.passIsGood && this.passIsSame && this.terms;
        }
    },
    methods: {
        async handleSubmit() {
            if (!this.isFormValid) return;

            try {
                await httpService.post('auth/signup', {
                    name: this.name,
                    surname: this.surname,
                    email: this.email,
                    password: this.password,
                });
                this.$router.push('/login');
            } catch (error) {
                // error is handled by interceptor
            }
        },
        togglePass(idx) {
            if (idx === 0) {
                this.eyeSvg = this.eyeSvg === "close-eye" ? "eye" : "close-eye";
                this.passFieldType = this.passFieldType === "password" ? "text" : "password";
            } else {
                this.eyeSvg2 = this.eyeSvg2 === "close-eye" ? "eye" : "close-eye";
                this.pass2FieldType = this.pass2FieldType === "password" ? "text" : "password";
            }
        }
    }
}
</script>

<style scoped lang="scss">
.registration-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid var(--card-border);
  border-radius: 12px;
  background: var(--card-bg);

  .field {
    margin-bottom: 1.5rem;
    text-align: left;
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--body-text); }
    input { 
      width: 100%; 
      padding: 0.75rem; 
      border: 1.5px solid var(--input-border); 
      border-radius: 8px;
      background-color: var(--input-bg);
      color: var(--body-text);
      
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
      position: absolute; right: 10px; background: none; border: none; cursor: pointer;
      display: flex; align-items: center;
    }
  }

  .password-requirements {
    margin-top: 0.5rem;
    font-size: 0.85rem;
    p { margin: 0.2rem 0; }
  }

  .valid { color: var(--success-color); &::before { content: "✔ "; } }
  .invalid { color: var(--danger-color); &::before { content: "✖ "; } }
  .invalid-text { color: var(--danger-color); font-size: 0.85rem; margin-top: 0.25rem; }

  .terms {
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--body-text);
    input { cursor: pointer; width: auto; }
    label { margin-bottom: 0; cursor: pointer; }
  }

  .submit button {
    width: 100%; 
    padding: 1rem; 
    background: var(--primary-color); 
    color: white; 
    border: none; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 1.1rem;
    font-weight: 700;
    transition: all 0.2s ease;

    &:hover:not(:disabled) { 
      filter: brightness(1.1);
      transform: translateY(-2px);
    }
    
    &:disabled { 
      background: var(--input-border); 
      cursor: not-allowed; 
      opacity: 0.6;
    }
  }
}
</style>
