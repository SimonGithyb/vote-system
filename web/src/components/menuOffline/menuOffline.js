import Drawer from 'primevue/drawer';
import Button from 'primevue/button';

export default {
  name: 'menu-offline',
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
    }
  }
}
