import axios from 'axios';

import config from '@/config';

export default {
    name: 'RegistrationComp',
    data() {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            password2: '',
        }
    },
    methods: {
        async handleSubmit() {
            await axios.post(`${config.API_URL}/auth/signup`, {
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: this.password,
            },
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        },
        async changePassWithFocus() {
            document.getElementById("message").style.display = "block";
        },
        async changePassWithBlur() {
            document.getElementById("message").style.display = "none";
        },
        async checkPassWithKeyup() {
            const myInput = document.getElementById("password");
            const letter = document.getElementById("letter");
            const capital = document.getElementById("capital");
            const number = document.getElementById("number");
            const length = document.getElementById("length");
            // Validate lowercase letters
            var lowerCaseLetters = /[a-z]/g;
            if(myInput.value.match(lowerCaseLetters)) {  
                letter.classList.remove("invalid");
                letter.classList.add("valid");
            } else {
                letter.classList.remove("valid");
                letter.classList.add("invalid");
            }
            
            // Validate capital letters
            var upperCaseLetters = /[A-Z]/g;
            if(myInput.value.match(upperCaseLetters)) {  
                capital.classList.remove("invalid");
                capital.classList.add("valid");
            } else {
                capital.classList.remove("valid");
                capital.classList.add("invalid");
            }

            // Validate numbers
            var numbers = /[0-9]/g;
            if(myInput.value.match(numbers)) {  
                number.classList.remove("invalid");
                number.classList.add("valid");
            } else {
                number.classList.remove("valid");
                number.classList.add("invalid");
            }
            
            // Validate length
            if(myInput.value.length >= 8) {
                length.classList.remove("invalid");
                length.classList.add("valid");
            } else {
                length.classList.remove("valid");
                length.classList.add("invalid");
            }
        },
        async checkEmail() {
            const email = await this.emailValidator(this.email);
            const emailInput = document.getElementById("email");
            
            if (!email) {
                console.log('work');
                emailInput.style.setProperty("border", "1px solid red");
                emailInput.style.setProperty("color", "red");
                return;
            }

            emailInput.style.setProperty("border", "1px solid black");
            emailInput.style.setProperty("color", "black");
        },
        async emailValidator(email) {
            return String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        async validateOnlyString(string, element) {
            const input = document.getElementById(element);
            if (!string.match(/^[a-zA-Z]/)) {
                input.style.setProperty("border", "1px solid red");
                input.style.setProperty("color", "red");
                return false;
            }

            input.style.setProperty("border", "1px solid black");
            input.style.setProperty("color", "black");
            return true;
        },
        async passwordIsSame() {
            if (this.password !== this.password2)  {
                return false;
            }
            return true;
        },
    }
}
