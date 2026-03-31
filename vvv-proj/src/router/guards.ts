import { useAuthStore } from '@/stores/auth'

import type { RouteLocationNormalized } from 'vue-router'

export const requireAuth = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  try {
    if (!authStore.isAuthenticated) {
      return '/login'
    }
    
    // Check if token is still valid
    const isValid = await authStore.refreshToken()
    if (isValid) {
      return true
    } else {
      return '/login'
    }
  } catch (error) {
    console.error('Authentication check failed:', error)
    return '/login'
  }
}

export const requireGuest = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return '/dashboard'
  } else {
    return true
  }
}

export const initializeAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
  return true
}
