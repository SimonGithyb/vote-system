import Drawer from 'primevue/drawer';
import Button from 'primevue/button';

export default {
  name: 'menu-online',
  components: {
    Drawer,
    Button
  },
  data() {
    return {
      mobileMenuVisible: false
    };
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuVisible = !this.mobileMenuVisible;
    },
    logout() {
      localStorage.clear();
      location.reload();
    }
  }
}
