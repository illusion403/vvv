import axios, { type AxiosResponse } from 'axios'
import type { AuthResponse, LoginCredentials, RegisterData, ApiError } from '@/types/auth'
import { mockAuthApi } from './mockAuth'

// Use mock API if VITE_USE_MOCK_API is true
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      errors: error.response?.data?.errors,
    }
    
    return Promise.reject(apiError)
  }
)

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (useMockApi) {
      return await mockAuthApi.login(email, password)
    }
    
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    if (useMockApi) {
      return await mockAuthApi.register(userData)
    }
    
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async (): Promise<void> => {
    if (useMockApi) {
      return await mockAuthApi.logout()
    }
    
    await api.post('/auth/logout')
  },

  refreshToken: async (): Promise<AuthResponse> => {
    if (useMockApi) {
      return await mockAuthApi.refreshToken()
    }
    
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/refresh')
    return response.data
  },

  me: async (): Promise<AuthResponse['user']> => {
    if (useMockApi) {
      return await mockAuthApi.me()
    }
    
    const response = await api.get('/auth/me')
    return response.data
  },
}

export default api
