import { useAuthStore } from '@/stores/auth'

export const requireAuth = async (to: any, from: any) => {
  const authStore = useAuthStore()
  
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
}

export const requireGuest = (to: any, from: any) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    return '/dashboard'
  } else {
    return true
  }
}

export const initializeAuth = (to: any, from: any) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
  return true
}
