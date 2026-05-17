import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    session: localStorage.getItem('session') === 'true',
    userId: localStorage.getItem('userId'),
    accessToken: localStorage.getItem('accessToken'),
  }),
  actions: {
    login(userData) {
      this.session = true;
      this.userId = userData.userId;
      this.accessToken = userData.accessToken;
      localStorage.setItem('session', 'true');
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('RefreshToken', userData.RefreshToken);
    },
    logout() {
      this.session = false;
      this.userId = null;
      this.accessToken = null;
      localStorage.removeItem('session');
      localStorage.removeItem('userId');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('RefreshToken');
    }
  }
});
