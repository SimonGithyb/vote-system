import { createRouter, createMemoryHistory } from 'vue-router';

import MainComp from '@/components/MainComp/MainComp.vue';
import LoginComp from '@/components/LoginComp/LoginComp.vue';
import RegistrationComp from '@/components/RegistrationComp/RegistrationComp.vue';

const routes = [
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
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;