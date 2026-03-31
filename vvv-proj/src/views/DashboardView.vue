<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ currentUser?.name }}!</span>
          <button @click="handleLogout" class="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="dashboard-content">
        <div class="welcome-card">
          <h2>Welcome to Your Dashboard</h2>
          <p>You are successfully logged in!</p>
          
          <div class="user-details">
            <h3>Your Information</h3>
            <div class="detail-item">
              <strong>Name:</strong> {{ currentUser?.name }}
            </div>
            <div class="detail-item">
              <strong>Email:</strong> {{ currentUser?.email }}
            </div>
            <div class="detail-item">
              <strong>User ID:</strong> {{ currentUser?.id }}
            </div>
            <div class="detail-item">
              <strong>Member Since:</strong> {{ formatDate(currentUser?.created_at) }}
            </div>
          </div>
        </div>

        <div class="dashboard-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button class="btn-action">Edit Profile</button>
            <button class="btn-action">Settings</button>
            <button class="btn-action">Help</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.dashboard-header {
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

.header-content h1 {
  color: #333;
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info span {
  color: #666;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #c82333;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-content {
  display: grid;
  gap: 2rem;
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  color: #333;
  margin-bottom: 1rem;
}

.welcome-card p {
  color: #666;
  margin-bottom: 2rem;
}

.user-details {
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.user-details h3 {
  color: #333;
  margin-bottom: 1rem;
}

.detail-item {
  margin-bottom: 0.75rem;
  color: #555;
}

.detail-item strong {
  color: #333;
  min-width: 120px;
  display: inline-block;
}

.dashboard-actions {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-actions h3 {
  color: #333;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-action:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }
}
</style>
