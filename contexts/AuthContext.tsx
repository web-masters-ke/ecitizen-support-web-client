'use client'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { authApi } from '@/lib/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  nationalId?: string
  role: string
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function loadCachedUser(): User | null {
  try {
    const raw = localStorage.getItem('authUser')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    return loadCachedUser()
  })
  const [loading, setLoading] = useState(true)

  const setAndCacheUser = useCallback((u: User | null) => {
    setUser(u)
    if (u) {
      localStorage.setItem('authUser', JSON.stringify(u))
    } else {
      localStorage.removeItem('authUser')
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me()
      setAndCacheUser(res.data.data)
    } catch {
      setAndCacheUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }, [setAndCacheUser])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      refresh().finally(() => setLoading(false))
    } else {
      setAndCacheUser(null)
      setLoading(false)
    }
  }, [refresh, setAndCacheUser])

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    const { accessToken, refreshToken, user: userData } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setAndCacheUser(userData)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore logout errors — clear session regardless
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAndCacheUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
