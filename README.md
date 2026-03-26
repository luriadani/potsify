# 🟢 Potsify

> The other side of Spotify. Songs nobody plays. Music nobody hears.

Potsify surfaces tracks with a **Spotify popularity score ≤ 30** — forgotten music buried deep in the catalog. Browse, select, and save them as a real Spotify playlist with one click.

![Potsify Screenshot](./docs/screenshot.png)

---

## Features

- 🔍 **Discovery feed** — random low-popularity tracks across ambient, folk, indie, jazz, and more
- 🔎 **Search mode** — search any keyword and filter results to under-30 popularity
- 🎚️ **Popularity slider** — tune the threshold (1–50) in real time
- ✅ **Multi-select** — pick any tracks and save them as a Spotify playlist
- 🟢 **Open in Spotify** — every track links directly to Spotify
- 🔐 **PKCE auth** — secure OAuth 2.0 flow, no backend required

---

## Tech Stack

- **React 18** + **Vite 5**
- **Spotify Web API** (search + playlists)
- **PKCE OAuth 2.0** (frontend-only, no server)
- CSS Modules (zero external UI libraries)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/potsify.git
cd potsify
npm install
```

### 2. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create App**
3. Set **Redirect URI** to `http://localhost:5173/callback`
4. Copy your **Client ID**

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/callback
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), click **Connect with Spotify**, and start digging.

---

## Deployment

```bash
npm run build
```

Deploy the `dist/` folder to **Vercel**, **Netlify**, or any static host.

> ⚠️ Remember to update `VITE_REDIRECT_URI` and add the production URL to your Spotify App's Redirect URIs in the dashboard.

---

## How "least played" works

Spotify exposes a `popularity` field (0–100) on every track, calculated from total play count and recency. Potsify only shows tracks **below your chosen threshold** (default: 30), sorted by lowest score first.

Popularity labels used in the UI:

| Score | Label   |
|-------|---------|
| 1–5   | Ghost   |
| 6–10  | Phantom |
| 11–20 | Hidden  |
| 21–30 | Low-key |

---

## Project Structure

```
potsify/
├── src/
│   ├── components/
│   │   ├── LoginScreen.jsx / .module.css
│   │   ├── Dashboard.jsx  / .module.css
│   │   ├── Header.jsx     / .module.css
│   │   ├── Controls.jsx   / .module.css
│   │   └── TrackCard.jsx  / .module.css
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useTracks.js
│   ├── utils/
│   │   ├── auth.js        ← PKCE OAuth flow
│   │   └── spotify.js     ← Spotify API calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vite.config.js
└── package.json
```

---

## License

MIT
