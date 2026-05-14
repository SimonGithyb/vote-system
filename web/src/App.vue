<template>
  <div id="app">
    <header>
      <div v-if="session">
        <menuOnline />
      </div>
      <div v-if="!session">
        <menuOffline />
      </div>
    </header>
     
    <main class="main-container container">
      <RouterView />
    </main>

    <Snackbar />

    <footer>
      &#169; 2025 Poland, All rights reserved. <strong>APPLICATION VERSION: ALFA 0.0.1</strong>
    </footer>
  </div>
</template>
<script>

import menuOffline from './components/menuOffline/menuOffline.vue';
import menuOnline from './components/menuOnline/menuOnline.vue';
import Snackbar from './components/Snackbar.vue';
import { useSnackbarStore } from '@/stores/snackbar';

export default {
  name: 'App',

  components: {
    menuOffline,
    menuOnline,
    Snackbar,
  },
  data() {
    return {
      session: false,
    }
  },
  methods: {
  },
  beforeMount() {
    this.session = localStorage.session;
    if (this.session) {
      const snackbar = useSnackbarStore();
      snackbar.show("you are logged in", {type: 'success'});
    }
  }
}

</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

a {
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.8;
  cursor: pointer;
}

.routerLink {
    text-decoration: none;
    color: var(--primary-color);
}
</style>
