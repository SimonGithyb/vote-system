import axios from 'axios';
import config from '@/config';
import { useAuthStore } from '@/stores/auth';
import { useSnackbarStore } from '@/stores/snackbar';
import router from '@/router';

const instance = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data?.message && response.config.method !== 'get') {
      const snackbar = useSnackbarStore();
      snackbar.show(response.data.message, { type: 'success' });
    }
    return response;
  },
  (error) => {
    const snackbar = useSnackbarStore();
    const authStore = useAuthStore();
    
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      authStore.logout();
      router.push('/login');
      snackbar.show("Session expired. Please login again.", { type: 'error' });
    } else {
      snackbar.show(message, { type: 'error' });
    }
    
    return Promise.reject(error);
  }
);

export default instance;
