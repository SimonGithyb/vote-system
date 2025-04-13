<template>
  <div><menuOffline/>
    <!-- <menuOnline v-if="session" />
    <menuOffline v-else /> -->
  </div>
   
  <RouterView  />
  
  <footer>
    &#169; 2025 Poland, All rights reserved. <strong>APPLICATION VERSION: ALFA 0.0.1</strong>
  </footer>
</template>

<script>
// import RegistrationComp from './components/RegistrationComp/RegistrationComp.vue';
// import LoginComp from './components/LoginComp/LoginComp.vue';
// import MainComp from './components/MainComp/MainComp.vue';
import menuOffline from './components/menuOffline/menuOffline.vue';
// import menuOnline from './components/menuOnline/menuOnline.vue';

export default {
  name: 'App',
  components: {
    menuOffline,
    // menuOnline,
  },
  data() {
    // session: false
  },
  method: {
    // checkSession() {
    //   this.session = localStorage.session;   
    // }
  } 
}

</script>

<style>
body {
  background: lightgray;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

a {
  margin: 20px;
  padding: 15;
  font-weight: bold;
}

a:hover {
  cursor: pointer;
}

.routerLink {
    text-decoration: none;
    color: green  ;
}

footer {
  position: fixed;
  bottom: 0;
}

</style>
