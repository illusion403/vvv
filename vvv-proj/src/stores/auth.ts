import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'
import { authApi } from '@/services/auth'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    
    // Decode token to get user info
    try {
      const decoded = jwtDecode<{ user: User; exp: number }>(newToken)
      user.value = decoded.user
    } catch (err) {
      console.error('Failed to decode token:', err)
      logout()
    }
  }

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.login(email, password)
      setToken(response.token)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authApi.register(userData)
      setToken(response.token)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const refreshToken = async () => {
    if (!token.value) return false
    
    try {
      const decoded = jwtDecode<{ exp: number }>(token.value)
      const currentTime = Date.now() / 1000
      
      // Refresh if token expires within 5 minutes
      if (decoded.exp - currentTime < 300) {
        const response = await authApi.refreshToken()
        setToken(response.token)
        return true
      }
      
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  // Initialize auth state
  const initializeAuth = () => {
    if (token.value) {
      try {
        const decoded = jwtDecode<{ user: User; exp: number }>(token.value)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp > currentTime) {
          user.value = decoded.user
        } else {
          logout()
        }
      } catch (err) {
        logout()
      }
    }
  }

  return {
    // State
    token,
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    initializeAuth,
    setToken
  }
})
