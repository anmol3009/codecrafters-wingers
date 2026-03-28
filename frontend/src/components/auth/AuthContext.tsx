import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  type User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth'
import { auth, googleProvider } from '../../lib/firebase'
import { api } from '../../lib/api'
import { useUserProgress } from '../../lib/useUserProgress'

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  
  const zustandLogin = useUserProgress(s => s.login)
  const zustandLogout = useUserProgress(s => s.logout)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const idToken = await getIdToken(currentUser)
        setToken(idToken)
        
        // Sync with Zustand
        zustandLogin(
          currentUser.displayName || currentUser.email || 'User',
          currentUser.email || '',
          idToken
        )

        // Sync with backend
        try {
          await api.auth.google(idToken)
        } catch (err) {
          console.error('Failed to sync with backend:', err)
        }
      } else {
        setToken(null)
        zustandLogout()
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [zustandLogin, zustandLogout])

  const loginWithGoogle = async () => {
    if (!auth) {
      alert('Authentication is currently disabled (No Firebase API Key provided).')
      return
    }
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      console.error('Google login failed:', err)
      throw err
    }
  }

  const logout = async () => {
    if (!auth) return
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Logout failed:', err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
