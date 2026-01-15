import httpService from '@/services/http.service';
import { useSnackbarStore } from '@/stores/snackbar';

export default {
    name: 'RegistrationComp',
    data () {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            passFieldType: 'password',
            password2: '',
            pass2FieldType: 'password',
            eyeSvg: 'close-eye',
            eyeSvg2: 'close-eye',
            terms: false,
            passIsGood: false,
            emailIsGood: false,
            passIsSame: false,
        }
    },
    methods: {
        async handleSubmit() {
            const valid = this.checkBeforeSendToApi();

            if (!valid)
                return;
            await httpService.signup({
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: this.password,
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
                this.passIsGood = true;
            } else {
                letter.classList.remove("valid");
                letter.classList.add("invalid");
                this.passIsGood = false;
            }
            
            // Validate capital letters
            var upperCaseLetters = /[A-Z]/g;
            if(myInput.value.match(upperCaseLetters)) {  
                capital.classList.remove("invalid");
                capital.classList.add("valid");
                this.passIsGood = true;
            } else {
                capital.classList.remove("valid");
                capital.classList.add("invalid");
                this.passIsGood = false;
            }

            // Validate numbers
            var numbers = /[0-9]/g;
            if(myInput.value.match(numbers)) {  
                number.classList.remove("invalid");
                number.classList.add("valid");
                this.passIsGood = true;
            } else {
                number.classList.remove("valid");
                number.classList.add("invalid");
                this.passIsGood = false;
            }
            
            // Validate length
            if(myInput.value.length >= 8) {
                length.classList.remove("invalid");
                length.classList.add("valid");
                this.passIsGood = true;
            } else {
                length.classList.remove("valid");
                length.classList.add("invalid");
                this.passIsGood = false;
            }
        },
        async checkEmail() {
            const email = await this.emailValidator(this.email);
            const emailInput = document.getElementById("email");
            
            if (!email) {
                console.log('work');
                emailInput.style.setProperty("border", "1px solid red");
                emailInput.style.setProperty("color", "red");
                this.emailIsGood = false;
                return;
            }

            emailInput.style.setProperty("border", "1px solid black");
            emailInput.style.setProperty("color", "black");
            this.emailIsGood = true;
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
                this.passIsSame = false;
                return false;
            }
            this.passIsSame = true;
            return true;
        },
        checkBeforeSendToApi() {
            const snackbar = useSnackbarStore();
            if (!this.terms) {
                snackbar.show('You must accept terms and conditions!');
                return false;
            } else if (!this.passIsGood) {
                snackbar.show('Your password does not meet the requirements');
                return false;
            }  else if (!this.passIsSame) {
                snackbar.show('Your passwords is dont same');
                return false;
            } else if (!this.emailIsGood) {
                snackbar.show('Email does not meet requirements');
                return false;
            } else {
                snackbar.show('Data in accordance with requirements');
                return true;
            }
        },
        obfuscateToggle(wp) {
            if (wp === 0) {
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
            } else {
                if (this.eyeSvg2 === "close-eye") {
                    this.eyeSvg2 = "eye";
                } else {
                    this.eyeSvg2 = "close-eye";
                }

                if (this.pass2FieldType == "password") {
                    this.pass2FieldType = "text";
                } else {
                    this.pass2FieldType = "password";
                }
            }
        },
    }
}
