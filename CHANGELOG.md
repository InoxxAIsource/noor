# MyTazki — Changelog

### 2026-05-14 — SEO Phase 4: 35 new Sanctuary Mode landing pages (42 total)

**New SSR route files (3 files, 35 routes):**

- **`sanctuary-anxiety-sleep.ts`** — 13 routes:
  - `/ruqyah-for-anxiety`, `/islamic-anxiety-help`, `/panic-attack-dua`, `/quran-verses-for-anxiety`, `/how-to-calm-anxiety-islam`, `/negative-thoughts-in-islam`, `/trust-allah-and-stop-overthinking`
  - `/islamic-sleep-meditation`, `/quran-for-sleep`, `/dua-before-sleep`, `/ruqyah-for-sleep`, `/surah-for-sleep`, `/night-dhikr`

- **`sanctuary-healing-rizq.ts`** — 13 routes:
  - `/dua-for-stress`, `/healing-through-quran`, `/sadness-in-islam`, `/allah-tests-those-he-loves`, `/healing-after-breakup-islam`, `/dua-for-heartbreak`, `/letting-go-in-islam`, `/allah-heals-broken-hearts`
  - `/dua-for-rizq`, `/barakah-in-rizq`, `/dua-for-job`, `/surah-for-rizq`, `/islamic-financial-stress`

- **`sanctuary-growth-spiritual.ts`** — 9 routes:
  - `/islamic-morning-routine`, `/morning-azkar`, `/daily-islamic-habits`, `/productive-muslim-routine`, `/fajr-routine`, `/muslim-mindfulness`, `/daily-tazkiyah`, `/healing-with-dhikr`, `/spiritual-burnout-islam`

**Infrastructure updates:**
- `app.ts` — 3 new router imports + `app.use()` registrations (SEO Phase 4 section)
- `artifact.toml` — 35 new paths added to the API server routing config
- `sitemap.xml` — 35 new URLs added across 3 annotated sections
- All pages: TypeScript typecheck clean ✓, HTTP 200 confirmed ✓

**Design language — Sanctuary Mode:**
- Cinematic hero sections: dark warm gradient backgrounds (`#09070A` → `#0d0a08`), radial atmospheric overlays
- DM Sans / Inter / Amiri typography with large display headings (clamp 1.85rem–2.9rem)
- Gold (`#c9a472`) mood labels, green (`#34c97a`) CTAs, warm muted body text (`#6e5e4c`)
- Each page: authentic Arabic duas with transliteration, Quranic ayat in Arabic + translation, FAQ schema, breadcrumb schema, Article schema, rel. articles grid

**9 pages already existed (not duplicated):**
`/dua-for-anxiety`, `/how-to-stop-overthinking-islam`, `/dua-for-overthinking`, `/islamic-mental-health`, `/islamic-habit-tracker`, `/islamic-self-improvement`, `/dua-for-loneliness`, `/islamic-healing-from-heartbreak`, `/quran-for-depression`

---

### 2026-05-14 — Sanctuary Mode deep sweep: zero old colors remain + SubscribePage/DownloadPage rewrites

**Complete palette audit — every remaining hardcoded old-green value eliminated:**

**Pages fully rewritten (Sanctuary Mode cinematic design):**
- **SubscribePage.tsx** — full rewrite: was `#001a00` deep green bg; now warm dark `#09070A` with sticky nav, amber gold plan highlights, green/gold tier accents, warm card backgrounds
- **DownloadPage.tsx** — full rewrite: same deep-green to Sanctuary Mode; sticky public nav, moon hero, warm feature grid cards, Sanctuary palette throughout

**Remaining old-palette values fixed across 8 more files:**
- **ForbiddenNamesPage.tsx** — `#4a7a4a` → `#6e5e4c` (warm muted), background rgba updated
- **TrendingNamesPage.tsx** — canvas OG-image colors: `#001a00→#09070A`, `#ffd700→#c9a472`, `#e8f5e8→#f0ece4`, `#4a7a4a→#6e5e4c`, `#00a550→#34c97a`, `#006622→#1a130d`
- **NamesPage.tsx** — same canvas OG-image fix
- **PlayerPage.tsx** — particle rain colors, scripture Arabic gold, scripture text cream, reference muted text, spinner border, keyframe box-shadows all updated
- **GrowthPage.tsx** — category color map (azkar/quran/other), heatmap color scale, mood chart line, khushoo bar chart — all axis ticks, gridlines and legend colors updated
- **QiblaPage.tsx** — compass SVG: north needle `#00a550→#34c97a`, compass rings, N label color
- **MasjidFinderPage.tsx** — full sweep: all inline template-literal HTML popup strings, map tile background, filter buttons, bottom sheet, spinner, location marker, Leaflet CSS override
- **AdminPage.tsx** — full sweep: all style constants (css/card/input/btn), header, tab buttons, metric cards, session/dua/name list rows, waitlist section
- **AIGuide.tsx, GiftPage.tsx, TasbihPage.tsx, index.css** — `rgba(0,165,80,…)` → `rgba(52,201,122,…)` across box-shadows, keyframes and beads

**Result: zero old green-palette values (`#001a00`, `#002800`, `#00a550`, `#4a7a4a`, `#ffd700`, `rgba(0,165,80,…)`) remain anywhere in the frontend codebase.**

---

### 2026-05-14 — Sanctuary Mode palette cascaded to ALL pages (full codebase sweep)

**Zero old green-palette values remain anywhere in the frontend:**

- **Batch replaced** across 29 pages + components: `#0d1411→#09070A`, `#152019→#16100a`, `#1c2d21→#1a130d`, `#b8946a→#c9a472`, `#6a9878→#6e5e4c`, `#2a3830→#241a10`, `#eaf4ee→#f0ece4`
- **NamesPage.tsx**: Arabic calligraphy canvas overlay changed from `rgba(0,165,80,…)` green to `rgba(201,164,114,…)` warm amber
- **IslamicCalendarPage.tsx**: Mawlid date badge converted from `text-green-400 bg-green-400/20` to CSS-variable brand green
- **DeenAppLogo.tsx**: SVG fill + text colors updated to new warm palette
- Pages updated: QuranSurahPage, MoodPage, SessionsPage, CompanionPage, ProfilePage, MorningFlow, NamesPage, QuranPage, DuasPage, PrayerTimesPage, PlayerPage, TasbihPage, GrowthPage, JournalPage, ZakatCalculatorPage, IslamicCalendarPage, NamesOfAllahPage, MasjidFinderPage, QiblaPage, AdminPage, OnboardingPage, LoginPage, FarzGuidePage, QurbaniGuidePage, SadqaGuidePage, WuduGuidePage, SalahGuidePage, BottomNav, DeenAppLogo
- All pages continue to use `var(--bg)`, `var(--surface)`, `var(--card)`, `var(--gold)`, `var(--muted)` via Tailwind CSS-variable syntax — the global `index.css` `:root` definition drives the entire visual system

---

### 2026-05-14 — Sanctuary Mode cinematic design adopted for Landing & Home pages

**Full visual overhaul — both public landing page and logged-in dashboard now use the approved Sanctuary Mode aesthetic:**

**LandingPage.tsx (`/`):**
- Cinematic full-screen hero — `woman-praying-night.png` with CSS film grade (`contrast(1.12) brightness(0.90) saturate(0.72)`)
- Warm amber multiply overlay + radial vignette + top scrim + bottom melt gradient
- Rotating Arabic verse floating over the image center with crisp stacked text-shadows (no blur wash-out)
- Translation + Quran reference with near-full opacity, gold accent
- Hero headline + CTAs in lower third over the dark melt
- Fixed nav with `rgba(9,7,10,0.82)` + `backdrop-filter: blur(22px)` — new ghost Sign In + green Start Free buttons
- Atmospheric second break section: `man-making-dua.png` with cinematic treatment + Arabic/English Quran 40:60 verse
- Bottom CTA section: `woman-reading-quran.png` with opacity overlay + Arabic + headline
- All section cards: warm dark palette (`#09070A` bg, `#16100a` surface, `#1a130d` card) with depth box-shadow
- Gold border accents (`rgba(201,164,114,0.16)`) on entry cards and trust cards
- Footer: warm dark, gold headings, cinematic brand logo

**HomePage.tsx (`/home`):**
- Cinematic 60vh hero — `man-making-dua.png` with same CSS film treatment
- Fixed Arabic verse in hero: `ألا بذكر الله تطمئن القلوب` (13:28) with multi-stop text-shadow
- Top bar: MYTAZKI wordmark + Search/Bell/Menu icons; slide-in side menu with all nav routes
- Search panel with session search, live results filtered from all sessions
- Greeting below hero: hijri date + first-name + time-of-day salutation + emotion insight
- Featured session card: breathing `breathe` animation on play button + expanding ring pulse
- Journey continuity card (gold accent border)
- Prayer times card: countdown timer + 5-prayer mini-row
- Emotion check-in (8 emotions in 4-col grid); persists via `/api/mood/checkin`
- Streak row: large gold number + 7-dot week indicator
- Name of Allah card (gold border, Scheherazade font)
- Quick dhikr row (3 cards, navigate to `/tasbih?dhikr=...`)
- AI Companion row (gold accent)
- Collapsible tools grid (4-col, 8 → 12 tools)
- All real API data wired: prayer times, hijri, streak, mood, sessions, nameOfAllah, progress

### 2026-05-13 — Language switcher now works globally

**Bug fix: language preference was saved but never applied**
- Created `LanguageContext` — reads user's saved language from the server, falls back to `localStorage`
- Switching to Arabic or Urdu now immediately sets `dir="rtl"` on the entire app (and `lang` attribute)
- Switching back to English restores `dir="ltr"` instantly
- Language preference is also persisted to `localStorage` (`tazki_lang`) so RTL survives page refresh before the user object loads
- ProfilePage language buttons now wire directly into the global context — change is instant on click, no save required for the UI to update
- Server PATCH (`/api/auth/me`) still saves the preference so it syncs across devices

### 2026-05-12 — AI Companion page + Bottom Nav + MoodPage redesign

**New page: /companion — Full-screen AI Islamic Guide:**
- Dedicated chat page replacing the floating button (☪️) in the nav
- Greeting-first flow: AI opens with a personalised As-salamu alaykum
- Quick prompts shown before first message (5 curated Islamic questions)
- Auto-resizing textarea input, Enter to send, Shift+Enter for newline
- Typing indicator with 3 animated bouncing dots
- Daily limit display with graceful limit-reached state
- Reset/new conversation button in header

**BottomNav redesign:**
- Old: Home, Salah, Quran, Duas, Profile
- New: Home, Salah, Sessions (centre, raised green circle), Guide (AI companion), Profile
- Sessions is now the primary CTA with a raised circular Play button
- Guide (☪️) links to the new /companion full-screen chat page

**MoodPage — full redesign with design tokens:**
- Replaced all hard-coded `#001a00`, `#00a550`, `#ffd700` with CSS variables
- Step progress indicator (3 animated pills at top)
- Mood grid: 8 buttons using `var(--surface)` + hover state
- Intensity step: cards with emoji, label, description — selection checkmark
- Results cards using `var(--card)` / `var(--green)` CTA
- Added floating animation to loading state spinner
- Now includes BottomNav for consistent navigation

---

### 2026-05-13 — Immersive Session Experience

Transforms guided sessions from content playback into emotionally immersive grounding experiences. All enhancements are incremental on top of existing audio infrastructure.

**Emotional Pathways — SessionsPage (Steps 3, 6)**
- New "Begin a Journey" section appears above the category grid with 6 curated pathways:
  - 🌊 Calm Anxiety → Duas · Breathing Dhikr · Peaceful Sleep
  - 🌅 Morning Grounding → Azkar · Quran Reflection · Dhikr
  - 🌿 Find Peace → Quran · Dhikr · Dua
  - 💚 Reconnect with Allah → Salah Guide · Quran · Evening Azkar
  - 🌙 Evening Wind-down → Sleep Reflection · Night Dhikr · Closing Dua
  - ✨ Gratitude Practice → Azkar · Gratitude Dua · Quran
- Each pathway card is collapsed by default (tap to expand), shows step pills with arrows
- Expanding shows up to 4 real sessions from the database, numbered in sequence
- "Begin this journey" CTA navigates to the first available session in the path

**Pathway Context in Player — Header (Step 1)**
- PlayerPage header now shows the emotional pathway name beneath the category badge
  e.g. "🌅 Morning Grounding path" / "🌙 Evening Wind-down path"
- Derived from session category via `CATEGORY_PATHWAY` mapping

**Atmospheric Ambient Ring (Steps 1, 4)**
- During audio playback, two concentric radial gradient rings appear around the play button
- Outer ring: 160px soft green glow, `ambientPulse` animation (4s ease-in-out, 0s delay)
- Mid ring: 120px slightly stronger, same animation staggered 0.5s
- Rings fade and disappear when audio is paused — environment matches emotional state
- New `@keyframes ambientPulse` added to PlayerPage stylesheet

**Pathway-aware Post-Session Continuity (Steps 5, 6)**
- Completion screen "Continue your journey" section is now pathway-aware:
  - Detects current session's category, maps to `CATEGORY_PATHWAY[cat].nextCat`
  - Surfaces 2 sessions from the NEXT category in the emotional pathway
  - Label: "🌅 Your next step on the Morning Grounding path — When you're ready — no rush."
  - Falls back to same-category related sessions if no pathway match or next sessions found
- Framing is supportive and unhurried, never pressuring

**SessionsPage visual polish**
- Redesigned session cards: cleaner spacing, softer borders, consistent design tokens
- Header now shows total session count
- Category and madhab filters redesigned with inline styles matching design tokens
- Grid uses 1fr/1fr with 10px gap for better breathing room

---

### 2026-05-13 — Emotional Retention System

Transforms MyTazki from an Islamic content platform into a daily emotional and spiritual grounding experience. All changes are incremental — no existing pages, routes, SEO, or audio infrastructure removed.

**Emotional Check-in (Step 1)**
- Full 8-emotion picker on HomePage: Anxious 🌊, Peaceful 🌿, Overwhelmed 🌧️, Lonely 🕊️, Grateful ✨, Frustrated 🔥, Grieving 💙, Joyful ☀️
- Shown prominently at top of home whenever no check-in logged today
- Confirmed state shows which emotion is active with a "change" link
- Check-in persists to `/api/mood/checkin` on every selection

**Emotional Memory (Step 2)**
- New `getMoodHistory(userId, days)` DB helper — reads last N days of mood entries
- New `GET /api/mood/history` route — returns history + a personalized insight string based on dominant emotion
- New `GET /api/progress/recent` route — returns last session played for journey continuity
- HomePage greeting sub-line replaced with warm personalized insight when emotional history exists
  e.g. "You've been navigating some challenges lately." / "Your heart has been full of gratitude."

**Session Recommendations by Emotion (Step 7)**
- `EMOTION_SESSIONS` map routes each emotional state to preferred session categories
  (e.g. anxious → healing/sleep/dua; grateful → azkar/quran)
- Featured session on HomePage is now emotionally matched when a check-in exists
- Section label changes: "Today's focus" → "For when you feel anxious"

**Journey Continuity (Step 4)**
- New continuity card on HomePage fetches last played session from `/api/progress/recent`
- Warm framing: "Continue your journey" + "You returned for another moment of reflection"
- Gold-accented card placed between morning flow and prayer times

**Streak Psychology (Step 5)**
- Replaced flat streak label with identity-reinforcing language:
  0 → "Your journey begins today"
  1 → "Day 1 of your journey 🌱"
  N → "N days of consistent remembrance"
- Added secondary line: "Masha'Allah — you're building a beautiful habit" at 7+ days
- No guilt-based language

**Reduced Utility Dominance (Step 6)**
- Islamic tools grid now shows only 4 tools by default
- "See all / Show less" toggle expands to full 12-tool grid
- Emotionally-driven experiences (check-in, continuity, sessions, companion) appear above tools

**Post-Session Reflection (Step 8)**
- PlayerPage completion flow now includes a warm reflection card between mood-after selection and the journal:
  "What stayed with your heart today?"
  "A single word, a feeling, or a moment — whatever came to you."
- Optional 200-char textarea with "Hold this ✦" / "Skip" actions
- On save: shows the note back as a quiet quote — or "That stillness is enough." if skipped

**AI Companion promoted**
- "Talk to your companion" card replaces the old "What do you need today?" utility link
- Direct navigation to `/companion`

---

### 2026-05-12 — Signup / Onboarding Redirect Loop — Root-cause fix (v2)

Two bugs were causing the register → onboarding → home loop:

**Bug 1 — RegisterPage `useEffect` race:**
- The `useEffect` watching `isLoggedIn` was firing immediately after `login(token)` set the token, overriding the explicit `navigate("/onboarding")` with `navigate("/home")`.
- Fix: added `justRegistered` ref. It is set to `true` before calling `login()` so the effect is silenced for the freshly-registered session.

**Bug 2 — OnboardingPage not updating auth context on complete:**
- `PATCH /api/auth/me` returns the full updated user object (with `onboardingComplete: true`), but `onSuccess` was ignoring it and navigating immediately.
- `ProtectedRoute` still saw `user.onboardingComplete === false` and bounced the user back to `/onboarding`.
- Fix: `onSuccess(updatedUser)` now calls `setAuthUser(updatedUser)` to sync the updated user into context **before** `navigate("/home", { replace: true })`.

Also: replaced the unused `login` import in `OnboardingPage` with `setAuthUser`.

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
