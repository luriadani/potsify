import React from 'react'
import styles from './TrackCard.module.css'

function formatDuration(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}

function PopularityBar({ value }) {
  const label =
    value <= 5 ? 'Ghost' :
    value <= 10 ? 'Phantom' :
    value <= 20 ? 'Hidden' :
    'Low-key'

  return (
    <div className={styles.popWrap}>
      <div className={styles.popBar}>
        <div className={styles.popFill} style={{ '--pct': `${value}%` }} />
      </div>
      <span className={styles.popLabel}>{label} · {value}</span>
    </div>
  )
}

export function TrackCard({ track, selected, onToggle }) {
  const handleOpen = (e) => {
    e.stopPropagation()
    window.open(track.spotifyUrl, '_blank', 'noopener')
  }

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onToggle(track.id)}
    >
      {/* Album art */}
      <div className={styles.artWrap}>
        {track.albumArt ? (
          <img src={track.albumArt} alt={track.album} className={styles.art} loading="lazy" />
        ) : (
          <div className={styles.artFallback}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9"/>
              <circle cx="12" cy="12" r="3"/>
              <line x1="12" y1="3" x2="12" y2="9"/>
            </svg>
          </div>
        )}
        <div className={styles.checkOverlay}>
          {selected && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>{track.artists.join(', ')}</p>
        <p className={styles.album}>{track.album}</p>
        <PopularityBar value={track.popularity} />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <span className={styles.duration}>{formatDuration(track.durationMs)}</span>
        <button
          className={styles.openBtn}
          onClick={handleOpen}
          title="Open in Spotify"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
