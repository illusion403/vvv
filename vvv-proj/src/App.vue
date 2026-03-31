<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <header>
    <div class="header-content">
      <div class="logo-section">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1>VVV Project</h1>
      </div>

      <nav class="main-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        
        <template v-if="isAuthenticated">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>
        
        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-section h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.logo {
  display: block;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}

.main-nav a {
  text-decoration: none;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.main-nav a:hover {
  background-color: #f8f9fa;
  color: #333;
}

.main-nav a.router-link-exact-active {
  color: #007bff;
  background-color: #e3f2fd;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

main {
  min-height: calc(100vh - 80px);
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-nav a,
  .logout-btn {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
