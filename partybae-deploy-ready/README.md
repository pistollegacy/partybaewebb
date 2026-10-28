# PARTYBAE — Digital Chaos System v2.0

The official hyperpop artist website for **PARTYBAE**. Built with Next.js 15, React 19, Tailwind CSS v4, and Motion.

## 🎵 Features

### Advanced Interactive Mouse System
- **Custom Cursor** — Neon pointer with trailing effect, dynamic sizing, animated click feedback
- **Context-Aware Hover States** — Shows "PLAY" on music artwork, "EXPLORE" on interactive elements, "VIEW" on links
- **Mouse-Reactive Background** — Particles follow cursor, ambient lighting follows mouse, parallax depth
- **Interactive PARTYBAE Logo** — 3D perspective tilt, liquid-chrome lighting, mouse-reactive highlights, tasteful glitch effects
- **3D Music Card Tilt** — Cards tilt in 3D based on cursor position, subtle zoom, reactive borders
- **Magnetic Buttons** — Subtle magnetic attraction, animated borders, glow changes, smooth click feedback

### Secret CHAOS MODE
Click the PARTYBAE logo 5 times to activate temporary **CHAOS MODE**:
- Stronger neon lighting
- Controlled glitch animations on logo and background
- Faster background particles
- Special visual transformation
- Exit button to return to normal mode

### Complete Automatic SoundCloud Sync
**The most important functional feature.**

- **Automatic Detection** — New public songs detected within ~5 minutes via Vercel Cron
- **Verified Metadata** — Titles, artwork (500×500), duration, genre, descriptions from SoundCloud API
- **Official Embedded Players** — Working SoundCloud players for every track
- **Automatic Removal** — Deleted/private songs removed after verified reconciliation
- **Metadata Updates** — Title, artwork, description changes reflected automatically
- **Complete Discography** — All 16+ public tracks with pagination support
- **Persistent Storage** — Upstash Redis for durable catalog storage
- **Webhook Support** — Real-time updates via SoundCloud webhooks (when configured)
- **Health Monitoring** — Sync status indicator with last/next sync timestamps

### Premium Typography
- **Unbounded** (Display) — Bold futuristic headings with chrome gradient
- **Space Grotesk** (Body) — Beautiful modern body text
- **JetBrains Mono** (Mono) — Technical labels and metadata
- Responsive `clamp()` typography throughout
- Perfect spacing, alignment, and visual hierarchy

### Incredible Homepage
- Enormous animated "PARTYBAE" wordmark with per-letter stagger
- Subtitle: "HYPERPOP FROM ANOTHER DIMENSION."
- Description: "Loud sounds. Digital chaos. No rules."
- Buttons: "EXPLORE THE MUSIC" & "ENTER MY WORLD"
- Mouse-reactive aurora orbs, floating shards, synthwave grid
- Equalizer strip, cinematic scroll cue

### Premium Music Section
- **Featured/Now Playing Panel** — Large artwork, track metadata, official SoundCloud embed
- **Full Discography Grid** — 3D tilt cards, search, sort (Latest/Oldest/A-Z)
- **SoundCloud Profile Embed** — Full catalog player with auto-updates
- **Sync Status Indicator** — Real-time health monitoring with manual sync trigger

### About Section
- Kinetic highlighted biography with per-word animations
- Identity spec card (AGE/GENRE/ARTIST/STATUS)
- Real SoundCloud avatar and profile link
- Signature with location

### PlayStation Gaming Section
- Holographic PSN identity card with 3D tilt
- PS button colors (△/○/✕/□) with authentic colors
- Working COPY USERNAME button with success animation
- Floating PS shapes with parallax

### Connect Section
- Polished SoundCloud link card
- PSN copy card with reusable component
- Extensible "Coming Soon" slot for future verified links

### Floating Music Controller
- Collapsed floating button with rotating icon
- Expanded controller with play/pause, prev/next, volume, progress
- Real SoundCloud Widget API integration
- Opens on SoundCloud link

### Performance & Accessibility
- 60 FPS optimized animations (CSS transforms, opacity)
- `requestAnimationFrame` for particle systems
- Cleaned event listeners, no memory leaks
- Mobile: Disables custom cursor, touch-friendly, simplified particles
- `prefers-reduced-motion` respected throughout
- No unexpected autoplay, semantic HTML, focus states, ARIA labels

## 🚀 Quick Start

```bash
cd partybae
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `SC_CLIENT_ID` | For live sync | SoundCloud API client ID. Register at [soundcloud.com/you/apps](https://soundcloud.com/you/apps). Without this, uses committed 16-track snapshot. |
| `SOUNDCLOUD_WEBHOOK_SECRET` | Optional | For verifying SoundCloud webhook signatures |
| `UPSTASH_REDIS_REST_URL` | For live sync | Upstash Redis REST URL from [console.upstash.com](https://console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | For live sync | Upstash Redis REST Token |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL for SEO/OG. Defaults to `https://partybae.vercel.app` |

## 📦 Catalog Verification & Sync

### Verified Snapshot (Committed)
`src/data/tracks.ts` contains **16 verified tracks** from SoundCloud API as of **2026-10-28**. Works with zero configuration.

### Live Sync (Production)
Set environment variables to enable automatic sync:
1. **Upstash Redis** — Create database at [console.upstash.com](https://console.upstash.com)
2. **SoundCloud App** — Register at [soundcloud.com/you/apps](https://soundcloud.com/you/apps) for Client ID
3. **Vercel Cron** — Runs `/api/sync` every 5 minutes automatically
4. **Webhook (Optional)** — Configure SoundCloud webhook to `/api/webhook` for real-time updates

**Sync Script** — Regenerate committed snapshot:
```bash
SC_CLIENT_ID=xxx UPSTASH_REDIS_REST_URL=xxx UPSTASH_REDIS_REST_TOKEN=xxx npm run sync:live
```

### Sync Status
The UI shows real-time sync health:
- **● SOUNDCLOUD SYNC ACTIVE** — Healthy, live data
- **◐ SYNC DEGRADED** — Temporary issues, showing last good data
- **✕ SYNC FAILED** — Persistent failure, showing snapshot

## 🏗️ Project Structure

```
partybae/
├── public/
│   ├── icon.svg           # Waveform favicon
│   └── manifest.json      # PWA manifest
├── scripts/
│   ├── sync-soundcloud.mjs    # Static snapshot generator
│   └── sync-live.mjs          # Live Redis sync script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── catalog/route.ts    # Catalog API with sync status
│   │   │   ├── sync/route.ts       # Manual sync trigger
│   │   │   └── webhook/route.ts    # SoundCloud webhook handler
│   │   ├── globals.css       # Tailwind v4 theme, animations
│   │   ├── layout.tsx        # Root layout, fonts, metadata
│   │   ├── page.tsx          # Server component, fetches catalog
│   │   └── opengraph-image.tsx   # Dynamic OG image (1200×630)
│   ├── components/
│   │   ├── ui/               # GlitchText, Magnetic, Equalizer
│   │   ├── background-fx.tsx     # Mouse-reactive particles + lighting
│   │   ├── cursor.tsx            # Custom cursor with trail & labels
│   │   ├── preloader.tsx         # One-time boot sequence
│   │   ├── nav.tsx               # Magnetic nav, mobile menu
│   │   ├── hero.tsx              # Interactive 3D logo, CHAOS MODE
│   │   ├── marquee.tsx           # Scrolling text
│   │   ├── section-heading.tsx   # Consistent section headers
│   │   ├── music.tsx             # Featured panel, grid, search, sort
│   │   ├── track-card.tsx        # 3D tilt, play overlay, HUD corners
│   │   ├── player-dock.tsx       # Bottom playback controller
│   │   ├── floating-music-controller.tsx  # Floating expanded controller
│   │   ├── sync-status.tsx       # Sync health indicator
│   │   ├── about.tsx             # Kinetic bio, identity card
│   │   ├── playstation.tsx       # 3D PSN card, copy button
│   │   ├── connect.tsx           # Social links, extensible
│   │   ├── footer.tsx            # Wordmark, sitemap, credits
│   │   └── site-shell.tsx        # Main layout composition
│   ├── data/
│   │   ├── site.ts           # All constants, config
│   │   └── tracks.ts         # Generated track catalog (16 tracks)
│   ├── lib/
│   │   ├── soundcloud.ts     # API, embed URLs, sync logic
│   │   ├── db.ts             # Upstash Redis operations
│   │   ├── player-store.ts   # Cross-component player state
│   │   └── utils.ts          # Formatters
│   └── types/
│       └── soundcloud-widget.d.ts
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── vercel.json               # Cron jobs, function config
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Design System

### Colors (Tailwind v4 `@theme` tokens)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-void` | `#05010a` | Page background |
| `--color-abyss` | `#0a0512` | Alt sections |
| `--color-panel` | `#0d0716` | Cards, panels |
| `--color-pulse` | `#a855f7` | Electric purple |
| `--color-bae` | `#ff2d9b` | Neon pink |
| `--color-acid` | `#c8ff2e` | Acid green |
| `--color-chrome` | `#d8d9e8` | Chrome silver |
| `--color-mist` | `#9d9ab4` | Muted text |

### Fonts (via `next/font/google`)

| Variable | Font | Weights |
|----------|------|---------|
| `--font-unbounded` | Unbounded | 400, 500, 700, 800 |
| `--font-grotesk` | Space Grotesk | 300–700 |
| `--font-jbmono` | JetBrains Mono | 400, 500, 700 |

### Key Utilities

- `.text-chrome` — Metallic gradient text
- `.text-plasma` — Purple→Pink→Acid gradient
- `.text-outline` — Outlined text (webkit-stroke)
- `.glass-panel` — Frosted glass card
- `.hud-corner*` — HUD corner brackets
- `.noise-overlay` — Subtle film grain
- `.eq-bar` — Animated equalizer bar
- `.input-range-styled` — Styled range inputs

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add Environment Variables (see above)
4. Deploy

### Vercel Cron
Automatically configured via `vercel.json`:
- `/api/sync` runs every 5 minutes (`*/5 * * * *`)
- 60s max duration for sync function

### Custom Domain
1. Vercel Project → Settings → Domains
2. Add `partybae.com`
3. Configure DNS at registrar:
   - A `@` → `76.76.21.21`
   - CNAME `www` → `cname.vercel-dns.com`
4. SSL auto-provisioned

## ♿ Accessibility

- Semantic HTML5 landmarks
- Single `<h1>` on hero, hierarchical headings
- Focus-visible outlines (acid color, 3px offset)
- ARIA labels on icon-only buttons
- `prefers-reduced-motion` disables all animations
- No unexpected autoplay (SoundCloud embeds require user gesture)
- Keyboard navigable (custom cursor disabled when not `pointer: fine`)
- WCAG AA contrast ratios

## ⚡ Performance

- Next.js 15 App Router with Server Components
- ISR revalidation (1 hour) for catalog freshness
- `next/image` for optimized artwork (AVIF/WebP, lazy loading)
- Motion animations GPU-accelerated (transform/opacity)
- Particle canvas pauses on `document.hidden`
- SoundCloud Widget API loaded lazy (`strategy="lazyOnload"`)
- Bundle: ~186 kB First Load JS

## 📝 Credits

- **Artist**: PARTYBAE (soundcloud.com/partybae)
- **PlayStation**: TOKYO-_-OCCULT
- **Fonts**: Unbounded, Space Grotesk, JetBrains Mono (Google Fonts)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion v12)
- **SoundCloud**: Official oEmbed & Widget API
- **Database**: Upstash Redis (Vercel Integration)
- **Design Inspiration**: Y2K cyberpunk, hyperpop visual culture, experimental editorial design

## 📄 License

Private project for PARTYBAE. All rights reserved.