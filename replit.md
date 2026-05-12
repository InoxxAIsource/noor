# MyTazki — AI Islamic Companion

An AI-first Islamic lifestyle PWA. "Grow Spiritually Every Day." A premium companion for guided Quran reflections, Azkar, Duas, prayer times, and personalized Islamic growth journeys for modern Muslims.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/noor run dev` — run the frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `JWT_SECRET` — JWT signing secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact `noor` at `/`)
- API: Express 5 (artifact `api-server` at `/api`)
- DB: `@replit/database` (key-value store, NOT PostgreSQL)
- Auth: JWT (jsonwebtoken) + bcryptjs
- AI: Anthropic Claude via Replit AI Integrations proxy
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `artifacts/api-server/src/lib/db.ts` — all @replit/database helpers
- `artifacts/api-server/src/lib/jwt.ts` — JWT sign/verify
- `artifacts/api-server/src/middleware/auth.ts` — requireAuth middleware
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/seed/` — seed data (sessions, duas, names, Names of Allah, hadiths)
- `artifacts/noor/src/contexts/AuthContext.tsx` — JWT auth context + useAuth hook
- `artifacts/noor/src/pages/` — all frontend pages
- `artifacts/noor/src/components/` — BottomNav, ProtectedRoute, shared components

## Architecture decisions

- **@replit/database instead of PostgreSQL**: Key-value store, no migrations needed. `db.get()` returns `OkResult | ErrResult` — always unwrap with `result.ok ? result.value : null`.
- **Contract-first API**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas. Never handwrite API fetch calls on the frontend.
- **JWT in localStorage**: Token stored as `tazki_token` (migrates from legacy `deen_token` automatically). Custom fetch in `lib/api-client-react/src/custom-fetch.ts` reads it automatically on every request.
- **Seed on startup**: API server seeds all content (sessions, duas, names, hadiths) on first boot if DB is empty.
- **AI rate limit**: 20 AI requests per user per day, tracked in `aiUsage:{userId}:{date}`.
- **External Quran data**: Verses fetched from `api.qurancdn.com`, audio from `everyayah.com` (Alafasy). No server-side caching needed.
- **External APIs**: Overpass API (mosque finder), metals.live (gold price), aladhan.com (Hijri dates + prayer times).

## Product — Part 1 (complete)

- Prayer Times: Live prayer times via aladhan.com API, salah logging with khushoo rating
- Streak Tracker: Daily streaks, weekly goals, progress rings
- Sessions: 25 guided audio sessions across AZKAR, QURAN, DHIKR, SLEEP, DUA60, SALAH categories
- Duas Library: curated duas with Arabic, transliteration, meaning, category filtering, favorites
- Baby Names: 40 Islamic names with Arabic, meaning, origin, prophet connection, gender filter
- Names of Allah: All 99 names with Arabic, transliteration, meaning, daily rotation
- Daily Content: Name of Allah + Hadith + Dua of the day (rotates daily by day-of-year)
- Tasbih: Digital dhikr counter
- AI Companion: MyTazki AI powered by Claude, 20 req/day limit, Islamic adab guidelines
- Onboarding: 5-step wizard (madhab, city/GPS, goals, language, reminder time)

## Product — Part 2 (complete)

- **Quran Reader** (`/quran`, `/quran/:number`): All 114 surahs, verse-by-verse with Arabic + English translation, ayah audio playback (Alafasy), bookmarks, continue reading
- **99 Names of Allah** (`/99-names`): Full list with daily featured name, search, detail modal
- **Qibla Compass** (`/qibla`): Mathematical bearing from GPS + SVG animated compass, distance to Kaaba
- **Masjid Finder** (`/masjid-finder`): Overpass API query, OSM iframe map, distance sort, save favourite
- **Zakat Calculator** (`/zakat-calculator`): Gold/silver/cash/debt inputs, live gold price (metals.live), nisab check, 2.5% calculation
- **Islamic Calendar** (`/islamic-calendar`): Hijri date via aladhan.com, Gregorian grid view, all major Islamic events
- **Qurbani Guide** (`/qurbani-guide`): Accordion sections + duas with Arabic, countdown to Eid ul Adha
- **Farz Guide** (`/farz-guide`): 8 accordion sections (Five Pillars, Salah, Wudu/Ghusl, 40 Sunnahs, Janazah, Aqiqah, Nikah, Halal/Haram) with keyword search
- **Sadqa Guide** (`/sadqa-guide`): Sadqa Jariyah, Nafilah, Fitrana calculator, daily suggestion widget
- **Wudu Guide** (`/wudu-guide`): 3 tabs (Wudu 11 steps / Ghusl / Tayammum), Read + Audio (step-by-step) modes, Arabic duas per step
- **Salah Guide** (`/salah-guide`): 5 prayers selector, full rakaat walkthrough with Arabic text, Read + Audio guide modes
- **Enhanced Duas** (`/duas`): 8 mood/emotion chips filter, detail modal, WhatsApp share
- **Enhanced Names** (`/names`): A-Z letter index, category chips (Quranic/Prophet/Sahaba/Rare/Trending), detail modal, share
- **Enhanced Tasbih** (`/tasbih`): SVG circular progress ring, 33 animated bead ring, vibration on completion, correct targets (34 for Allahu Akbar), session total
- **Home Tools Grid**: 12-tile Islamic Tools grid on homepage linking to all tools
- **Landing Page** (`/`): Public marketing page with Arabic ticker, hero, feature grid; auto-redirects logged-in users to `/home`

## New API routes (Part 2)

- `GET /api/names-of-allah` — all 99 Names from DB
- `GET /api/masjid/nearby?lat=&lng=` — Overpass proxy, returns sorted mosque list
- `GET /api/masjid/favourite` + `POST /api/masjid/favourite` — per-user favourite masjid (auth required)
- `GET /api/zakat/gold-price` — metals.live proxy, INR/gram conversion
- `GET /api/prayer/hijri` — today's Hijri date (public, no auth required)

## Routes (all frontend pages)

```
/                 /login           /register          /onboarding
/home             /prayer-times    /duas              /names
/player/:id       /tasbih          /profile           /quran
/quran/:number    /mood            /99-names          /qibla
/masjid-finder    /zakat-calculator  /islamic-calendar  /qurbani-guide
/farz-guide       /sadqa-guide     /wudu-guide        /salah-guide
/journal          /rooms           /room/:code        /growth
/halaqah          /halaqah/:code   /halaqah/:code/admin
/names/trending   /names/forbidden /gift/:token
/subscribe        /download        /admin
```

## Design tokens

```css
--bg: #001a00  --surface: #002800  --card: #003800
--green: #00a550  --gold: #ffd700  --text: #e8f5e8
--muted: #4a7a4a  --border: rgba(0,165,80,0.18)
```
Fonts: Cinzel (headings/logo) | Amiri (Arabic, always rtl) | system-ui (body/nav)

## User preferences

- **Always update `replit.md` and push to GitHub after every change or implementation.** This is a standing rule for every session.
- GitHub repo: `https://github.com/InoxxAIsource/noor` (main branch)

## Changelog

### 2026-05-12 — Full rebrand DeenApp → MyTazki
- **Brand name**: All UI, SEO, AI prompts, manifest, meta tags, room codes updated from DeenApp → MyTazki / MYTAZKI
- **Domain**: `deenapp.app` → `mytazki.com` across all canonical URLs, og:url, sitemap, JSON-LD, SEO pages, robots.txt
- **Auth token**: `deen_token` → `tazki_token` in localStorage; AuthContext migrates old token automatically on first load
- **Room codes**: `DEEN-XXXX` → `TAZKI-XXXX` format
- **New color palette** (premium redesign): `--bg:#0d1411` · `--surface:#152019` · `--card:#1c2d21` · `--green:#34c97a` · `--gold:#b8946a` · `--text:#eaf4ee` · `--muted:#6a9878` · `--faint:#2a3830`
- **Typography**: DM Sans added as primary font (bold, modern) alongside Inter — replaces Cinzel for headings
- **Logo**: `DeenAppLogo.tsx` rewritten — clean crescent+star icon mark on dark bg, "My**Tazki**" wordmark in Inter 800, emerald "My" prefix
- **Favicon**: Updated SVG crescent+star in emerald (#34c97a) on dark charcoal background
- **Manifest**: Updated PWA name/short_name/description/theme_color (#34c97a)
- **Landing page**: Full Headspace-inspired premium redesign — rotating Quranic Arabic verses, "Grow Spiritually Every Day." hero, feature grid, session preview, AI companion demo, Quranic bottom CTA
- **SEO shared.ts**: All templates updated — nav, footer, CTA block, breadcrumbs, appRedirectBar reads both tazki_token and deen_token
- **All SEO pages**: landing.ts, comparison.ts, blog-seo.ts, duas-seo.ts, names-seo.ts, quran-seo.ts, prayer-times-seo.ts, tools-seo.ts, sitemap.ts all rebranded
- **index.html**: Full MyTazki SEO rebrand — title, meta description, OG tags, JSON-LD, canonical URL, keywords, Google Fonts (DM Sans + Inter + Amiri)
- **Typecheck**: Clean across all packages

### 2026-05-12 — Masjid Finder full-screen map + real GPS location
- **Full-screen map**: `MasjidFinderPage` rebuilt with `position:fixed;inset:0` layout — map fills entire viewport, header floats as an overlay, bottom sheet slides up with mosque list
- **Real GPS location**: Added `enableHighAccuracy:true, timeout:15000, maximumAge:0` to `getCurrentPosition` — now requests true GPS fix, not coarse IP-based position
- **Error handling**: Specific messages for permission denied (code 1), position unavailable (code 2), timeout (code 3) with "Try Again" button
- **"Locate Me" button**: Persistent button in header to re-request GPS at any time; "Centre on me" FAB (Navigation icon) re-centres map on user position
- **Bottom sheet**: Mosque list in a draggable-feel bottom panel (opens automatically when mosques load, tap handle to toggle), mosque markers show NEAREST badge
- **Map init**: Map loads immediately on mount (world view) then flies to user location once GPS resolves — no blank waiting state
- **Typecheck**: Clean

### 2026-05-12 — Masjid Finder rebuilt + Baby Names expanded to 1000

#### Masjid Finder — critical bug fix + interactive map
- **Root cause**: Overpass API query used `"religion"="muslim"` (incorrect tag) — all mosques tagged as `"religion"="islam"` in OpenStreetMap, returning 0 results every time
- **Fix**: Query changed to `"religion"="islam"` + upgraded from `node` to `nwr` (node/way/relation) + `out center tags` to capture mosque buildings and complexes, not just nodes
- **Coordinates**: Updated element extraction to use `el.lat ?? el.center?.lat` for ways/relations (which have `el.center.lat` not `el.lat`)
- **Interactive Leaflet map**: Replaced static OSM iframe with full `leaflet` interactive map (already installed: `leaflet`, `@types/leaflet`) — shows user position (green dot), mosque markers (🕌 gold pin), popups with name/distance/directions on click, `flyTo` animation on list item click
- **UI rebuilt**: Filter chips (All/Sunni/Shia/Jama Masjid), favourite star persisted to localStorage + API, nearest marker opens popup automatically, Google Maps fallback link, refresh button, empty-state links
- **Typecheck**: Clean across both packages

#### Baby Names expanded 500 → 1000
- **500 new names added**: Boys rank 251–500 (250 names) + Girls rank 251–500 (250 names)
- **Origins**: Arabic, Persian, Turkish, Urdu, Malay — all authentic Islamic names with full field data (Arabic script, Urdu, meaning, origin, Quran reference where applicable, Prophet connection)
- **Notable additions**: Hamzah, Uthman, Salman, Bilal, Junayd, Rayyan, Anas, Maaz, Owais (boys); Zahra, Laila, Isra, Taqwa, Kausar, Malaak, Sidra, Haneen, Yara (girls)
- **Reseed applied**: `POST /api/admin/names/reseed` — confirmed 1000 names live in DB
- **Typecheck**: Clean

### 2026-05-12 — SEO improvements (Lighthouse: page blocked from indexing)
- **Root cause**: Lighthouse ran on the Replit dev/`.replit.app` URL — Replit intentionally adds `X-Robots-Tag: noindex` to dev domains; `deenapp.app` custom domain has no such header
- **Sitemap domain fixed**: `noorapp.com` → `deenapp.app` in `sitemap.ts` BASE URL and Sitemap directive in `robots.txt`
- **Canonical tag added**: `<link rel="canonical" href="https://deenapp.app/">` in `index.html`
- **og:url + og:image added**: full Open Graph set now complete with `https://deenapp.app/og-image.png`
- **JSON-LD structured data**: `MobileApplication` schema + `Organization` schema injected into `index.html`
- **Keywords meta tag added**: targets key queries (Islamic prayer app, salah times, namaz times, Quran reader, etc.)
- **`lang` + `dir` attributes**: `<html lang="en" dir="ltr">` now explicit
- **robots meta expanded**: `max-snippet:-1, max-image-preview:large` added for richer Google results
- **Sitemap link in `<head>`**: `<link rel="sitemap">` tag added
- **Typecheck**: Clean across all packages

### 2026-05-12 — DeenApp rebrand: new logo + favicon (removed Noor/نور)
- **Logo**: Created `DeenAppLogo.tsx` reusable component — dark green rounded-square icon with gold crescent moon + 5-pointed star, gradient "DEENAPP" wordmark in Cinzel, gold drop-shadow glow
- **Favicon**: Replaced red dot (`#FF3C00`) in `public/favicon.svg` with the crescent+star icon on dark green background — visible in browser tab and bookmark bar
- **Noor removed**: Replaced Arabic `نور` headings in LoginPage, RegisterPage, GiftPage with the new `DeenAppLogo` component
- **An-Nur (Surah 24)**: Left `النور` in QuranPage intact — it is the name of a Quran chapter, not app branding

### 2026-05-12 — Islamic Tools grid restored on HomePage
- **Root cause**: The 12-tile Islamic Tools grid was missing from the HomePage — Masjid Finder, Qibla, Zakat, Calendar, and all other tools were unreachable from home
- **Fix**: Added 3-column tools grid (Section 11) between Quick Tasbih and Healing Sessions, covering all 12 tools: Quran, Qibla, Masjid Finder, Zakat, Calendar, 99 Names, Farz Guide, Wudu Guide, Salah Guide, Sadqa, Qurbani, Baby Names
- **Typecheck**: Clean

### 2026-05-12 — Duas library expanded (26 → 110 across all 20 categories)
- **Root cause**: Only 26 duas in DB; categories Food, Anxiety, Grief, Work, Study, Marriage, Children had zero entries
- **Fix**: Rewrote `seed/duas.ts` with 110 authentic duas from Quran and Hadith covering all 20 UI categories
- **Coverage**: ~5-6 duas per category: Morning, Evening, Protection, Forgiveness, Salah, Daily Life, Sleep, Travel, Hardship, Gratitude, Family, Quran, Food, Anxiety, Grief, Work, Study, Marriage, Children
- **Admin endpoint**: `POST /api/admin/duas/reseed` — force-replaces all duas from seed without restarting
- **Typecheck**: Clean across all packages

### 2026-05-12 — HEALING category + 10 new sessions + player enhancements
- **10 new HEALING sessions** added: Healing Through Sujood, Dua for Overthinking, Surah Ad-Duha Reflection, Trusting Allah in Hard Times, Slowing Down in Salah, Sleep with Ayatul Kursi, Letting Go with Tawakkul, Tahajjud Companion, Rizq Anxiety Session, Finding Peace After Isha
- **Session total: 35** (was 25) across 7 categories: AZKAR, QURAN, DHIKR, SLEEP, DUA60, SALAH, HEALING
- **All 35 sessions have Alafasy audio** — patch-audio endpoint extended to cover all new titles
- **Admin endpoint**: `POST /api/admin/sessions/add-healing` — non-destructive append (duplicate-safe by title)
- **Player enhancements**: Arabic text glow pulse (`arabicPulse` keyframe), play button breathing animation while playing (`breathe` keyframe), smoother progress bar with CSS transitions, fade-in-up entrance for scripture block, ambient gold radial backdrop behind Arabic
- **Homepage healing section**: `Sparkles` icon, Ayat 26:80 in Amiri as header, 2 featured HEALING session cards with dark emerald gradient + gold border, tappable to player
- **Design preserved**: same emerald/gold palette, card radius, spacing, typography — feels like natural evolution not redesign

### 2026-05-11 — Session audio wired up (everyayah.com + Islamic Network CDN)
- **All 25 sessions** now have `audioUrl` populated — no more "Audio coming soon"
- **Source**: Sheikh Alafasy recitations from `everyayah.com` (per-ayah) and `cdn.islamic.network` (full surahs)
- **Mapping**: QURAN sessions → full surah MP3; AZKAR/DHIKR/SLEEP/DUA60/SALAH → referenced Quran verse
- **Admin endpoint**: `POST /api/admin/sessions/patch-audio` re-applies all mappings without reseeding
- **Both CDNs verified**: HTTP 200 on both `everyayah.com` and `cdn.islamic.network`

### 2026-05-11 — Session card loading fix
- **Root cause**: HomePage had hardcoded fallback session cards (`morning-azkar`, `evening-azkar`, etc.) shown while API data loaded. Clicking them sent the player to `/player/morning-azkar` which returned 404.
- **Fix 1 — HomePage**: Replaced fallback hardcoded sessions with animated skeleton placeholders while sessions load from API. Real session IDs are only used once the API data arrives.
- **Fix 2 — PlayerPage**: Split the `isLoading || !session` guard into two separate states — proper spinner while loading, clear "Session not found" error screen with back button when 404.
- **Fix 3 — PlayerPage**: Added `retry: false` to `useGetSession` so React Query doesn't retry 404s 3× (which caused the apparent hang).

### 2026-05-11 — Home, Player, Mood, Growth, Zakat, Masjid overhaul (Prompt 7)
- **P1 — Home screen**: Fetches sessions from `/api/sessions?limit=4` (live API, no longer hardcoded); fetches prayer times + hijri from backend API; Muharram (month 1) + default hijri banner added alongside Ramadan; prayer card tappable → `/prayer-times`; BottomNav added; paddingBottom: 80
- **P4 — Player**: 30-second progress autosave interval added (saves `durationListened` while playing); `POST /api/streak/checkin` called on session complete
- **P5 — Mood engine**: Intensity selection now shows a "Find my dua →" button before triggering the API (two-step: select intensity → confirm → load); loading state full-screen with animated crescent; results use inline design tokens
- **P6 — Growth**: Already complete from prior session; no changes needed
- **P7 — Zakat**: API response renamed `pricePerGramINR` → `pricePerGram`, added `nisab` field; `GoldPriceCache` interface updated in `db.ts`; frontend reads new field names; nisab threshold from API used in calculation
- **P8 — Masjid**: API now returns `mapsUrl` + `distanceKm` per mosque alongside existing `distance`
- **Typecheck**: All clean (both `@workspace/api-server` and `@workspace/noor`)
- **API tests**: Sessions 25+, Names 500, Duas public, Prayer times, Hijri, Gold price — all ✅

### 2026-05-11 — Public Routes, 500 Names, Manifest PWA Enhancements
- **Names expanded**: Seed file rebuilt from 40 → 500 Islamic names (250 boys + 250 girls); fully seeded into DB via `POST /admin/names/reseed` endpoint (now live)
- **Public routes**: Removed `requireAuth` from `GET /api/duas` and `GET /api/prayer/times`; both are now fully public. Auth is optional — `isFavorite` still populated when token present
- **optionalAuth middleware**: Added `optionalAuth` function in `artifacts/api-server/src/middleware/auth.ts` for routes that benefit from auth but don't require it
- **Admin reseed**: Added `POST /admin/names/reseed` endpoint to force-replace all names from seed data without restarting the server
- **Manifest.json**: Updated PWA manifest with `start_url: /home`, 4 shortcuts (Prayer Times, Quran, Tasbih, Duas), `lang`, `dir`, and proper description
- **Typecheck clean**: Fixed pre-existing `landing.ts` SEO head missing `schema: []` error; all typechecks pass cleanly

### 2026-05-11 — Full Audit & DeenApp Rebrand
- **Rebrand**: All "Noor"/"NOOR" UI references renamed to "DeenApp"/"DEENAPP" across 30+ files (frontend pages, SEO layer, AI system prompts, admin panel, seed data, share text)
- **Token rename**: `noor_token` → `deen_token` in localStorage across all 16 files (AuthContext, 13 pages, SEO shared.ts)
- **New route**: `GET /api/prayer/hijri` — was returning 404, now returns today's Hijri date (public endpoint)
- **AI prompts**: All 4 Claude system prompts updated from "Noor" to "DeenApp"
- **Landing page**: Public `/` route with hero, feature grid, Arabic bismillah ticker; login/register pages auto-redirect if already logged in + `← Home` back link
- **Manifest + meta**: `index.html` title, OG tags, apple-mobile-web-app-title, `manifest.json` name/short_name all updated
- **Room codes**: `NOOR-XXXX` → `DEEN-XXXX` format
- **SEO files**: `shared.ts`, `landing.ts`, `comparison.ts`, `tools-seo.ts`, `prayer-times-seo.ts`, `quran-seo.ts`, `blog-seo.ts`, `duas-seo.ts` fully rebranded

## Gotchas

- `@replit/database` v3: `db.get()` / `db.list()` return `{ ok, value }` — use the `dbGet`/`dbList` wrappers in `db.ts`, never call `db.get()` directly in routes.
- `useGetSession(id, options)` — first param is string ID, not an object.
- All generated query hooks require `queryKey` in options if you pass a custom `query` option — use the exported `getGet*QueryKey()` helpers.
- Never call services directly by port. Always use `localhost:80/<path>` through the shared proxy.
- Seed data is written to @replit/database on first boot only (checks if DB is empty first).
- Part 2 pages (Quran, Qibla, Masjid, Zakat, Calendar, guides) use direct `fetch()` calls to external APIs or `/api/...` — not generated hooks. Generated hooks only exist for Part 1 endpoints.
- New API routes (namesOfAllah, masjid, zakat, prayer/hijri) are NOT in openapi.yaml — add them before running codegen.
- localStorage auth token key is `deen_token` (was `noor_token` — changed during rebrand).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
