import type { AuthResponse, RegisterData, LoginCredentials } from '@/types/auth'

// Mock user data
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Mock token (fake JWT for testing)
const generateMockToken = (user: any) => {
  // Create a proper JWT-like token with 3 parts (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000)
  }))
  const signature = 'mock-signature' // Mock signature
  
  return `${header}.${payload}.${signature}`
}

// Simulate network delay
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAuthApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(1000) // Simulate network delay
    
    // Accept any email and password for testing
    // Create user based on provided email
    const loginUser = {
      ...mockUser,
      email: email,
      name: email.split('@')[0] || 'User', // Use email prefix as name, fallback to 'User'
      id: Math.floor(Math.random() * 1000)
    }
    
    // Generate token with the login user
    const token = (() => {
      const payload = {
        user: loginUser,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
        iat: Math.floor(Date.now() / 1000)
      }
      return btoa(JSON.stringify(payload))
    })()
    
    return {
      token: generateMockToken(loginUser),
      user: loginUser
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    await delay(1000) // Simulate network delay
    
    // Check if email already exists (only for test@example.com)
    if (userData.email === 'test@example.com') {
      const error: any = new Error('Email already exists')
      error.errors = { email: ['This email is already taken'] }
      throw error
    }
    
    // Create new user
    const newUser = {
      ...mockUser,
      name: userData.name,
      email: userData.email,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    const token = (() => {
      const payload = {
        user: newUser,
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
        iat: Math.floor(Date.now() / 1000)
      }
      return btoa(JSON.stringify(payload))
    })()
    
    return {
      token: generateMockToken(newUser),
      user: newUser
    }
  },

  logout: async (): Promise<void> => {
    await delay(500)
  },

  refreshToken: async (): Promise<AuthResponse> => {
    await delay(500)
    
    // Get current user from token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Parse JWT token (header.payload.signature)
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          const user = payload.user || mockUser
          return {
            token: generateMockToken(user),
            user: user
          }
        }
      } catch {
        return {
          token: generateMockToken(mockUser),
          user: mockUser
        }
      }
    }
    
    return {
      token: generateMockToken(mockUser),
      user: mockUser
    }
  },

  me: async (): Promise<AuthResponse['user']> => {
    await delay(500)
    
    // Get current user from token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // Parse JWT token (header.payload.signature)
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          return payload.user || mockUser
        }
      } catch {
        return mockUser
      }
    }
    
    return mockUser
  },
}
