import { useState, useCallback } from 'react'
import {
  fetchDiscoveryFeed,
  searchLowPopularityTracks,
  createPlaylist,
  MAX_POPULARITY,
} from '../utils/spotify'

export function useTracks() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const [maxPop, setMaxPop] = useState(MAX_POPULARITY)
  const [playlistUrl, setPlaylistUrl] = useState(null)
  const [creatingPlaylist, setCreatingPlaylist] = useState(false)

  const loadFeed = useCallback(async (threshold = maxPop) => {
    setLoading(true)
    setError(null)
    setPlaylistUrl(null)
    try {
      const data = await fetchDiscoveryFeed(threshold)
      setTracks(data)
      setSelected(new Set())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [maxPop])

  const search = useCallback(async (query) => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchLowPopularityTracks(query, maxPop)
      setTracks(data)
      setSelected(new Set())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [maxPop])

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelected(new Set(tracks.map((t) => t.id)))
  }, [tracks])

  const clearSelection = useCallback(() => {
    setSelected(new Set())
  }, [])

  const savePlaylist = useCallback(async (userId) => {
    const toSave = tracks.filter((t) => selected.has(t.id))
    if (!toSave.length) return

    setCreatingPlaylist(true)
    try {
      const playlist = await createPlaylist(userId, toSave)
      setPlaylistUrl(playlist.external_urls?.spotify)
    } catch (e) {
      setError(e.message)
    } finally {
      setCreatingPlaylist(false)
    }
  }, [tracks, selected])

  return {
    tracks,
    loading,
    error,
    selected,
    maxPop,
    setMaxPop,
    playlistUrl,
    creatingPlaylist,
    loadFeed,
    search,
    toggleSelect,
    selectAll,
    clearSelection,
    savePlaylist,
  }
}
