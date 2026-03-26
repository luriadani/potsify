import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'

export default function App() {
  const { user, loading, error, login, logout, isLoggedIn } = useAuth()
  const [entered, setEntered] = useState(false)

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Always show welcome screen unless user has explicitly entered the app
  if (!entered || !isLoggedIn) {
    return (
      <LoginScreen
        onLogin={() => {
          if (isLoggedIn) {
            setEntered(true)
          } else {
            login()
          }
        }}
        isLoggedIn={isLoggedIn}
        userName={user?.display_name}
        error={error}
      />
    )
  }

  return <Dashboard user={user} onLogout={() => { logout(); setEntered(false) }} />
}
