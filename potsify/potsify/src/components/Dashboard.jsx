import React, { useEffect } from 'react'
import { Header } from './Header'
import { Controls } from './Controls'
import { TrackCard } from './TrackCard'
import { useTracks } from '../hooks/useTracks'
import styles from './Dashboard.module.css'

export function Dashboard({ user, onLogout }) {
  const {
    tracks, loading, error,
    selected, maxPop, setMaxPop,
    playlistUrl, creatingPlaylist,
    loadFeed, search,
    toggleSelect, selectAll, clearSelection,
    savePlaylist,
  } = useTracks()

  // Load on mount
  useEffect(() => {
    loadFeed()
  }, [])

  const handleSave = () => savePlaylist(user.id)

  return (
    <div className={styles.root}>
      <Header user={user} onLogout={onLogout} />

      <Controls
        maxPop={maxPop}
        onMaxPopChange={setMaxPop}
        onSearch={search}
        onRefresh={() => loadFeed(maxPop)}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        selectedCount={selected.size}
        totalCount={tracks.length}
        onSavePlaylist={handleSave}
        creatingPlaylist={creatingPlaylist}
        playlistUrl={playlistUrl}
        loading={loading}
      />

      <main className={styles.main}>
        {error && (
          <div className={styles.error}>
            <span>⚠ {error}</span>
            <button onClick={() => loadFeed(maxPop)}>Retry</button>
          </div>
        )}

        {loading && tracks.length === 0 && (
          <div className={styles.loading}>
            <div className={styles.loadingDisc}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.loadingRing} style={{ '--i': i }} />
              ))}
              <div className={styles.loadingCenter} />
            </div>
            <p className={styles.loadingText}>Digging through crates…</p>
          </div>
        )}

        {!loading && tracks.length === 0 && !error && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No tracks found</p>
            <p className={styles.emptyHint}>Try raising the max popularity score or a different search.</p>
          </div>
        )}

        {tracks.length > 0 && (
          <>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Unplayed &amp; Unscored</span>
              <span className={styles.sectionMeta}>
                Popularity ≤ {maxPop} · sorted by obscurity
              </span>
            </div>

            <div className={styles.grid}>
              {tracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  selected={selected.has(track.id)}
                  onToggle={toggleSelect}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
