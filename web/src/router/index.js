import { createRouter, createWebHistory } from 'vue-router';

import MainComp from '@/components/MainComp/MainComp.vue';
import LoginComp from '@/components/LoginComp/LoginComp.vue';
import RegistrationComp from '@/components/RegistrationComp/RegistrationComp.vue';
import voteCastComp from '@/components/voteModules/voteCastComp/voteCastComp.vue';
import voteCreatorComp from '@/components/voteModules/voteCreatorComp/voteCreatorComp.vue';


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
      name: 'voteCastComp',
      component: voteCastComp,
    },
    {
      path: '/createVotes',
      name: 'voteCreatorComp',
      component: voteCreatorComp,
    }
],
});

export default router;