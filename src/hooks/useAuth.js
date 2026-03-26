import { useState, useEffect, useCallback } from 'react'
import {
  isLoggedIn,
  initiateLogin,
  exchangeCode,
  logout as authLogout,
  getValidToken,
} from '../utils/auth'
import { getCurrentUser } from '../utils/spotify'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On mount: check for callback code or existing session
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        try {
          await exchangeCode(code)
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname)
        } catch (e) {
          setError('Login failed. Please try again.')
          setLoading(false)
          return
        }
      }

      if (isLoggedIn()) {
        try {
          const token = await getValidToken()
          if (token) {
            const profile = await getCurrentUser()
            setUser(profile)
          }
        } catch (e) {
          // Token might be expired / invalid
          authLogout()
        }
      }

      setLoading(false)
    }

    init()
  }, [])

  const login = useCallback(() => {
    initiateLogin()
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return { user, loading, error, login, logout, isLoggedIn: !!user }
}
