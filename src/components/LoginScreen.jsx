import React from 'react'
import styles from './LoginScreen.module.css'

export function LoginScreen({ onLogin, error }) {
  return (
    <div className={styles.root}>
      {/* Background vinyl rings */}
      <div className={styles.vinyl}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.ring} style={{ '--i': i }} />
        ))}
        <div className={styles.vinylCenter} />
      </div>

      <div className={styles.content}>
        <div className={styles.badge}>RECORD CRATE</div>
        <h1 className={styles.title}>
          <span className={styles.pot}>POT</span>SIFY
        </h1>
        <p className={styles.tagline}>
          The other side of Spotify.<br />
          Songs nobody plays. Music nobody hears.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>&lt;30</span>
            <span className={styles.statLabel}>Popularity Score</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>∞</span>
            <span className={styles.statLabel}>Forgotten Tracks</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>0</span>
            <span className={styles.statLabel}>Hype</span>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.loginBtn} onClick={onLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect with Spotify
        </button>

        <p className={styles.note}>
          We use PKCE auth — your credentials never touch our servers.
        </p>
      </div>
    </div>
  )
}
