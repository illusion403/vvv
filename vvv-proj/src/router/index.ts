import { createRouter, createWebHistory } from 'vue-router'
import { initializeAuth, requireAuth, requireGuest } from './guards'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresGuest: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresGuest: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  // Initialize auth state
  const initResult = await initializeAuth(to, from)
  if (initResult !== true) {
    return next(initResult)
  }
  
  // Check route meta for authentication requirements
  if (to.meta.requiresAuth) {
    const authResult = await requireAuth(to, from)
    if (authResult !== true) {
      return next(authResult)
    }
  } else if (to.meta.requiresGuest) {
    const guestResult = requireGuest(to, from)
    if (guestResult !== true) {
      return next(guestResult)
    }
  }
  
  next()
})

export default router
