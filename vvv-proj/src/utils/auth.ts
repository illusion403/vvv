import { jwtDecode } from 'jwt-decode'

export interface JwtPayload {
  user: {
    id: number
    name: string
    email: string
  }
  exp: number
  iat: number
}

export const authUtils = {
  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch {
      return true
    }
  },

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return new Date(decoded.exp * 1000)
    } catch {
      return null
    }
  },

  // Check if token will expire within specified minutes
  willTokenExpireSoon(token: string, minutes: number = 5): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000
      const timeUntilExpiry = decoded.exp - currentTime
      return timeUntilExpiry < (minutes * 60)
    } catch {
      return true
    }
  },

  // Get user from token
  getUserFromToken(token: string): JwtPayload['user'] | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.user
    } catch {
      return null
    }
  },

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate password strength
  validatePassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Store token in localStorage
  storeToken(token: string): void {
    localStorage.setItem('token', token)
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token')
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('token')
  },

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem('token')
    // You can also clear other auth-related data here
    // localStorage.removeItem('user_preferences')
    // localStorage.removeItem('session_data')
  }
}

export default authUtils
