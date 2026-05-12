# MyTazki — Changelog

### 2026-05-12 — Signup Redirect Loop Fix

- `RegisterPage`: after successful register, immediately sets the user object in auth context via `setAuthUser(data.user)` before navigating — prevents the async `getMe()` race condition that caused the signup → onboarding → redirect loop
- `AuthContext`: `setAuthUser` exposed so pages can synchronously hydrate user state after registration

---

### 2026-05-12 — Calm Dashboard Rebuild + Peaceful Morning Flow

**Dashboard (HomePage.tsx) — full rebuild:**
- New design using official tokens: `#0d1411` bg, `#34c97a` green, `#b8946a` gold, `#eaf4ee` text, `#6a9878` muted
- Removed: floating particles, crescent SVG animation, horizontal scroll carousels, cluttered widget wall
- Time-aware greeting: Good morning / afternoon / evening / night with contextual subtitle
- Peaceful Morning CTA as hero card — primary daily retention loop
- Inline emotional check-in chips (6 emotions) if no mood recorded today
- Prayer times card (compact, kept)
- Streak shown with warm language: "X days of ibadah" not "STREAK"
- Today's focus: one session surfaced based on time of day (azkar in morning, quran afternoon, sleep evening)
- Name of Allah card (daily)
- Quick dhikr row (SubhanAllah / Alhamdulillah / Allahu Akbar)
- "What do you need today?" mood/dua entry point
- Simplified 4-col tools grid (all 12 tools preserved)
- Slide-in side menu + search panel

**New page: /morning — Peaceful Morning Flow:**
- 5-step guided ritual: Greeting → Quran insight → Emotional check-in → AI reflection → Spiritual action → Completion
- Step progress indicator at top
- Curated rotating Quran insights (5 ayahs)
- 6 emotional states with emoji: peaceful, grateful, anxious, distracted, overwhelmed, tired
- AI contextual reflection via new `POST /api/mood/reflect` endpoint (Claude Sonnet)
- Emotion-specific tiny spiritual action (dua/dhikr tailored to state)
- Morning streak counter: "X peaceful mornings" shown on completion
- Fallback reflections if AI unavailable

**New API routes (mood.ts):**
- `GET /api/mood/today` — today's emotion + morning completion status + morning streak
- `POST /api/mood/checkin` — save emotional state for the day
- `POST /api/morning/complete` — mark morning flow done, increment streak
- `POST /api/mood/reflect` — AI-generated Islamic reflection based on emotional state

**New DB helpers (db.ts):**
- `getMoodCheckin` / `setMoodCheckin` — key: `mood:{userId}:{date}`
- `getMorningStatus` / `setMorningComplete` — key: `morning:{userId}:{date}`
- `getMorningStreak` / `incrementMorningStreak` — key: `morningStreak:{userId}`

### 2026-05-12 — Quran reader: Play All sequential playback fix
- **Root cause**: `useCallback` + `new Audio()` per ayah caused two bugs: (1) stale closure in `onended` meant `playAyahAt` called wrong version after ayah 1-2; (2) iOS Safari autoplay policy blocks `new Audio().play()` for any audio not linked to original user gesture
- **Fix**: Single persistent `Audio` element created once at mount — only `audio.src` + `audio.load()` + `audio.play()` called per ayah, maintaining iOS autoplay continuity
- **Ref-based state**: `sequentialRef`, `currentAyahRef`, `numRef`, `playFnRef` — all mutable refs so the single `ended` listener always reads live values without stale closures
- **Single listener**: `audio.addEventListener("ended", onEnded)` set once in a `[]` useEffect — reliably fires for every ayah in sequence
- **Fallback**: If `play()` is rejected (page unfocused etc.), sequential mode skips to next ayah after 1s rather than stopping

### 2026-05-12 — Quran reader: switch to alquran.cloud API + 12s timeout
- Switched from `api.qurancdn.com` (timing out on mobile) to `api.alquran.cloud/v1/surah/{n}/editions/quran-uthmani,en.asad`
- Added `AbortController` with 12-second hard timeout — never hangs forever

### 2026-05-12 — Quran reader: per-ayah audio + visible Arabic/translation text
- Arabic text visible: verse-level `text_uthmani` rendered in `#f0ede8` with robust font stack
- Translation visible: HTML/footnote tags stripped, rendered in `#a8c8b0`
- Per-ayah Play button using `everyayah.com/data/Alafasy_128kbps/SSSAAA.mp3`
- "Play All" sequential mode with 4-second gap between ayahs

### 2026-05-12 — Quran reader route fix: /quran/read/:number
- `/quran/:number` was intercepted by API server's SEO `/quran` path
- Fix: moved to `/quran/read/:number`, added `/quran/read` to Noor artifact.toml paths
- `/quran` (list) still goes to SEO server; `/quran/read/:number` routes to React SPA

### 2026-05-12 — Full rebrand DeenApp → MyTazki
- Brand name, domain, auth token, room codes, color palette, typography, logo, favicon, manifest, landing page, all SEO pages updated
- New palette: `--bg:#0d1411` `--green:#34c97a` `--gold:#b8946a` `--text:#eaf4ee`
- DM Sans added as primary heading font alongside Inter

### 2026-05-12 — Masjid Finder full-screen map + real GPS
- Fixed: Overpass query changed `"religion"="muslim"` → `"religion"="islam"`
- Upgraded from `node` to `nwr` query type; added `out center tags`
- Interactive Leaflet map replacing static OSM iframe
- Full-screen fixed layout with floating header + slide-up bottom sheet
- Real GPS with `enableHighAccuracy:true`

### 2026-05-12 — Baby Names expanded 500 → 1000
- 500 new names: Boys 251-500 + Girls 251-500; Arabic/Persian/Turkish/Urdu/Malay origins

### 2026-05-12 — Push Notifications
- `web-push` installed; VAPID keys in env vars
- Routes: `/api/notifications/subscribe|status|preferences|test|vapid-public-key`
- Prayer scheduler: fires 5 min before each prayer + dua/hadith/streak reminders
- `useNotifications` hook + redesigned bell panel

### 2026-05-12 — Dashboard header: Bell, Search, Menu panels
- Bell: prayer countdown, streak, Name of Allah, hadith
- Search: live across sessions/duas/names with Quick Access shortcuts
- Menu: slide-in drawer with 24 routes across 5 sections

### 2026-05-12 — Homepage SEO/GEO Transformation
- Single H1, 6 H2 sections, internal link engine (20+ links), emotional entry points
- Authority hub grid, guided journeys, AI companion section, trust block, FAQ accordion
- JSON-LD: Organization + WebSite (SearchAction) + FAQPage + BreadcrumbList
- 6-column semantic SEO footer with 36+ crawlable links

### 2026-05-12 — SEO Phase 3: Entity Authority + Distribution
- 12 entity/trust pages, 6 GEO landing pages, 5 start-here funnel pages
- E-E-A-T `eeatBar()` component on all pages

### 2026-05-12 — Duas library expanded 26 → 110
- 110 authentic duas across all 20 categories; `POST /api/admin/duas/reseed` endpoint

### 2026-05-12 — HEALING category + 10 new sessions
- 10 HEALING sessions added; total 35 sessions across 7 categories
- Player: Arabic glow pulse, play button breathe animation, ambient gold backdrop

### 2026-05-12 — Em dash removal (site-wide)
- 1,153 em dashes replaced with `, ` or `-` across 30+ files

### 2026-05-12 — SEO improvements
- Canonical tag, og:url/og:image, JSON-LD, keywords meta, sitemap link in head

### 2026-05-12 — Islamic Tools grid restored on HomePage
- 12-tile grid covering all tools between Quick Tasbih and Healing Sessions

### 2026-05-11 — Session audio wired up
- All 25 sessions have `audioUrl`: everyayah.com (per-ayah) + cdn.islamic.network (full surahs)

### 2026-05-11 — Session card loading fix
- Replaced hardcoded fallback cards with skeleton placeholders
- PlayerPage: split loading/404 states; `retry: false` on useGetSession

### 2026-05-11 — Public Routes, 500 Names, Manifest
- `GET /api/duas` and `GET /api/prayer/times` now public; `optionalAuth` middleware added
- Names seed: 40 → 500; PWA manifest with shortcuts

### 2026-05-11 — Home, Player, Mood, Growth, Zakat, Masjid overhaul
- Home: live sessions API, prayer times + hijri from backend, BottomNav
- Player: 30s autosave, streak checkin on complete
- Mood: two-step intensity → confirm → load
- Zakat: `pricePerGram` + `nisab` fields from API
- Masjid: `mapsUrl` + `distanceKm` fields

### 2026-05-12 — Quran reader: continuous Mushaf-style flow (superseded)
- This design was later replaced by the per-ayah card layout for reliability

### 2026-05-12 — Part 2 features shipped
- Quran Reader, 99 Names, Qibla Compass, Masjid Finder, Zakat Calculator, Islamic Calendar, Qurbani Guide, Farz Guide, Sadqa Guide, Wudu Guide, Salah Guide, Enhanced Duas/Names/Tasbih, Landing Page
