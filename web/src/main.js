import "primeicons/primeicons.css";
import "./style.css";
import "./flags.css";
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';


import AppState from './plugins/appState.js';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import Noir from './presets/Noir.js';

loadFonts()
const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: '.p-dark',
            cssLayer: false,
        }
    }
  })
  .use(AppState)
  .use(ConfirmationService)
  .use(ToastService)
  .use(DialogService)
  .component('ThemeSwitcher', ThemeSwitcher)
  .mount('#app')
