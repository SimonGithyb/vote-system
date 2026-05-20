import { createRouter, createWebHistory } from 'vue-router';

import MainComp from '@/components/MainComp/MainComp.vue';
import LoginComp from '@/components/LoginComp/LoginComp.vue';
import RegistrationComp from '@/components/RegistrationComp/RegistrationComp.vue';
import VoteModule from '@/components/voteModules/VoteModule.vue';


const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: '/',
      name: 'MainComp',
      component: MainComp,
    },
    {
      path: '/login',
      name: 'LoginComp',
      component: LoginComp,
    },
    {
      path: '/signup',
      name: 'RegistrationComp',
      component: RegistrationComp,
    },
    {
      path: '/votes',
      name: 'Votes',
      component: VoteModule,
    }
],
});

export default router;