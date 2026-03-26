import React from 'react'
import styles from './Header.module.css'

export function Header({ user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.disc}>
          <div className={styles.discInner} />
        </div>
        <span className={styles.wordmark}>
          <span className={styles.pot}>POT</span>SIFY
        </span>
      </div>

      <div className={styles.right}>
        {user && (
          <>
            <div className={styles.user}>
              {user.images?.[0]?.url ? (
                <img src={user.images[0].url} alt={user.display_name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarFallback}>
                  {user.display_name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <span className={styles.displayName}>{user.display_name}</span>
            </div>
            <button className={styles.logoutBtn} onClick={onLogout}>
              Sign out
            </button>
          </>
        )}
      </div>
    </header>
  )
}
