// Spotify PKCE Auth Flow
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || ''
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + '/callback'
const SCOPES = [
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-private',
].join(' ')

function generateCodeVerifier(length = 128) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

async function generateCodeChallenge(verifier) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function initiateLogin() {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  localStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function exchangeCode(code) {
  const verifier = localStorage.getItem('pkce_verifier')
  if (!verifier) throw new Error('No PKCE verifier found')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  })

  if (!response.ok) throw new Error('Token exchange failed')
  const data = await response.json()

  const expiresAt = Date.now() + data.expires_in * 1000
  localStorage.setItem('spotify_access_token', data.access_token)
  localStorage.setItem('spotify_refresh_token', data.refresh_token || '')
  localStorage.setItem('spotify_expires_at', String(expiresAt))

  localStorage.removeItem('pkce_verifier')
  return data.access_token
}

export async function refreshToken() {
  const rt = localStorage.getItem('spotify_refresh_token')
  if (!rt) return null

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: rt,
      client_id: CLIENT_ID,
    }),
  })

  if (!response.ok) return null
  const data = await response.json()
  const expiresAt = Date.now() + data.expires_in * 1000
  localStorage.setItem('spotify_access_token', data.access_token)
  localStorage.setItem('spotify_expires_at', String(expiresAt))
  return data.access_token
}

export async function getValidToken() {
  const token = localStorage.getItem('spotify_access_token')
  const expiresAt = Number(localStorage.getItem('spotify_expires_at') || 0)

  if (token && Date.now() < expiresAt - 60_000) return token
  return refreshToken()
}

export function logout() {
  localStorage.removeItem('spotify_access_token')
  localStorage.removeItem('spotify_refresh_token')
  localStorage.removeItem('spotify_expires_at')
}

export function isLoggedIn() {
  return !!localStorage.getItem('spotify_access_token')
}
