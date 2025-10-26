<template>
  <div>
    <div v-if="session">
      <menuOnline />
    </div>
    <div v-if="!session">
      <menuOffline />
    </div>
  </div>
   
  <RouterView  />
  
  <footer>
    &#169; 2025 Poland, All rights reserved. <strong>APPLICATION VERSION: ALFA 0.0.1</strong>
  </footer>
</template>

<script>

import menuOffline from './components/menuOffline/menuOffline.vue';
import menuOnline from './components/menuOnline/menuOnline.vue';


export default {
  name: 'App',
  components: {
    menuOffline,
    menuOnline,
  },
  data() {
    return {
      session: false,
    }
  },
  method: { 
  },
  beforeMount() {
    this.session = localStorage.session;
  }
}

</script>

<style>
body {
  background: #2a3439;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
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
