<template>
<section class="menu-container">
  <!-- Desktop Navigation -->
  <nav class="desktop-nav">
    <RouterLink to="/" class="routerLink">HOME</RouterLink>
    <RouterLink to="/votes" class="routerLink">VOTES</RouterLink>
    <a @click="logout" class="routerLink">LOGOUT</a>
    <ThemeSwitcher />
  </nav>

  <!-- Mobile Navigation -->
  <div class="mobile-nav">
    <div class="mobile-header">
      <span class="logo-text">VOTE WORLD</span>
      <div class="mobile-actions">
        <ThemeSwitcher />
        <Button icon="pi pi-bars" @click="toggleMobileMenu" text severity="secondary" />
      </div>
    </div>
    
    <Drawer v-model:visible="mobileMenuVisible" header="Menu" position="right">
      <div class="mobile-menu-links">
        <RouterLink to="/" @click="mobileMenuVisible = false">HOME</RouterLink>
        <RouterLink to="/votes" @click="mobileMenuVisible = false">VOTES</RouterLink>
        <a @click="logout" class="logout-link">LOGOUT</a>
      </div>
    </Drawer>
  </div>
</section>
</template>

<script>
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'MenuOnline',
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
    async logout() {
      const auth = useAuthStore();
      try {
        // Optional: call backend logout
        // await httpService.get('auth/logout');
      } catch (e) {
        // ignore
      }
      auth.logout();
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped lang="scss">
.menu-container {
    background: var(--card-bg);
    border-bottom: 1px solid var(--card-border);
    margin-bottom: 2rem;
    width: 100%;
}

.desktop-nav {
    display: none;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    padding: 1rem;
}

.mobile-nav {
    display: block;
}

.mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
}

.logo-text {
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--primary-color);
    letter-spacing: 1px;
}

.mobile-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.mobile-menu-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem 1rem;
    
    a {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--body-text);
        text-decoration: none;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--card-border);
        cursor: pointer;
        
        &.router-link-active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
        }
    }
    
    .logout-link {
        color: var(--danger-color, #ef4444);
    }
}

a.routerLink {
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
    
    &:hover {
        color: var(--primary-hover);
    }
}

@media (min-width: 768px) {
    .desktop-nav {
        display: flex;
    }
    
    .mobile-nav {
        display: none;
    }
}
</style>
