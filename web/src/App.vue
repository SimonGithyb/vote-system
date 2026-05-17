<template>
  <div id="app">
    <header>
      <div v-if="auth.session">
        <MenuOnline />
      </div>
      <div v-else>
        <MenuOffline />
      </div>
    </header>
     
    <main class="main-container container">
      <RouterView />
    </main>

    <Snackbar />

    <footer>
      &#169; 2025 Poland, All rights reserved. <strong>APPLICATION VERSION: ALFA 0.0.2</strong>
    </footer>
  </div>
</template>

<script>
import MenuOffline from './components/MenuOffline/MenuOffline.vue';
import MenuOnline from './components/MenuOnline/MenuOnline.vue';
import Snackbar from './components/Snackbar.vue';
import { useAuthStore } from '@/stores/auth';
import { useSnackbarStore } from '@/stores/snackbar';

export default {
  name: 'App',
  components: {
    MenuOffline,
    MenuOnline,
    Snackbar,
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  mounted() {
    if (this.auth.session) {
      const snackbar = useSnackbarStore();
      snackbar.show("Welcome back!", {type: 'success'});
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

.main-container {
  min-height: 70vh;
}

footer {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}
</style>
