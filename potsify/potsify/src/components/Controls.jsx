import React, { useState } from 'react'
import styles from './Controls.module.css'

export function Controls({
  maxPop, onMaxPopChange, onSearch, onRefresh, onSelectAll, onClearSelection,
  selectedCount, totalCount, onSavePlaylist, creatingPlaylist, playlistUrl, loading,
}) {
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState('discover') // 'discover' | 'search'

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setMode('search')
      onSearch(query.trim())
    }
  }

  const handleDiscover = () => {
    setMode('discover')
    setQuery('')
    onRefresh()
  }

  return (
    <div className={styles.controls}>
      {/* Top row */}
      <div className={styles.top}>
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'discover' ? styles.active : ''}`}
            onClick={handleDiscover}
          >
            Discover
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'search' ? styles.active : ''}`}
            onClick={() => setMode('search')}
          >
            Search
          </button>
        </div>

        {mode === 'search' ? (
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Artist, track, or album…"
              className={styles.searchInput}
              autoFocus
            />
            <button type="submit" className={styles.searchBtn} disabled={loading}>
              {loading ? '…' : 'Search'}
            </button>
          </form>
        ) : (
          <button className={styles.refreshBtn} onClick={handleDiscover} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            )}
            Shuffle feed
          </button>
        )}
      </div>

      {/* Popularity filter */}
      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Max popularity score</span>
        <input
          type="range"
          min={1}
          max={50}
          value={maxPop}
          onChange={(e) => onMaxPopChange(Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.filterValue}>{maxPop}</span>
      </div>

      {/* Selection bar */}
      {totalCount > 0 && (
        <div className={styles.selectionBar}>
          <span className={styles.count}>
            {totalCount} track{totalCount !== 1 ? 's' : ''}
            {selectedCount > 0 && ` · ${selectedCount} selected`}
          </span>

          <div className={styles.selActions}>
            {selectedCount < totalCount ? (
              <button className={styles.selBtn} onClick={onSelectAll}>Select all</button>
            ) : (
              <button className={styles.selBtn} onClick={onClearSelection}>Deselect all</button>
            )}

            {selectedCount > 0 && (
              <button
                className={styles.saveBtn}
                onClick={onSavePlaylist}
                disabled={creatingPlaylist}
              >
                {creatingPlaylist ? 'Creating…' : `Save ${selectedCount} to Spotify`}
              </button>
            )}
          </div>

          {playlistUrl && (
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.openPlaylist}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Open playlist in Spotify ↗
            </a>
          )}
        </div>
      )}
    </div>
  )
}
