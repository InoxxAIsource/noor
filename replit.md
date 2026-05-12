# MyTazki — AI Islamic Companion

An AI-first Islamic lifestyle PWA. "Grow Spiritually Every Day." A premium companion for guided Quran reflections, Azkar, Duas, prayer times, and personalized Islamic growth journeys for modern Muslims.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/noor run dev` — frontend (proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks + Zod schemas from OpenAPI spec
- Required env: `JWT_SECRET`, `SESSION_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact `noor` at `/`)
- API: Express 5 (artifact `api-server` at `/api`)
- DB: `@replit/database` (key-value store, NOT PostgreSQL)
- Auth: JWT (jsonwebtoken) + bcryptjs; token key: `tazki_token` in localStorage
- AI: Anthropic Claude via Replit AI Integrations proxy
- Push: `web-push` with VAPID keys
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas
- `artifacts/api-server/src/lib/db.ts` — all @replit/database helpers
- `artifacts/api-server/src/lib/jwt.ts` — JWT sign/verify
- `artifacts/api-server/src/middleware/auth.ts` — requireAuth + optionalAuth middleware
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/api-server/src/seed/` — seed data (sessions, duas, names, Names of Allah, hadiths)
- `artifacts/noor/src/contexts/AuthContext.tsx` — JWT auth context + useAuth hook
- `artifacts/noor/src/pages/` — all frontend pages
- `artifacts/noor/src/components/` — BottomNav, ProtectedRoute, shared components
- `artifacts/noor/src/hooks/useNotifications.ts` — push notification hook

## Architecture decisions

- **@replit/database**: Key-value store, no migrations. `db.get()` returns `OkResult | ErrResult` — always unwrap with `result.ok ? result.value : null`.
- **Contract-first API**: OpenAPI spec → Orval codegen → React Query hooks + Zod schemas. Never handwrite API fetch calls on the frontend.
- **JWT in localStorage**: `tazki_token` (auto-migrates from legacy `deen_token`). Custom fetch in `lib/api-client-react/src/custom-fetch.ts` reads it on every request.
- **Seed on startup**: API server seeds all content on first boot if DB is empty.
- **AI rate limit**: 20 AI requests per user per day, tracked in `aiUsage:{userId}:{date}`.
- **Quran data**: Arabic + translation from `api.alquran.cloud`; audio from `everyayah.com` (Alafasy, per-ayah SSSAAA.mp3 format).
- **External APIs**: Overpass API (mosque finder), metals.live (gold price), aladhan.com (Hijri + prayer times).
- **Push notifications**: VAPID keys in env vars; prayer scheduler runs every 60s; per-user subscriptions at `push:{userId}`.
- **Quran reader audio**: Single persistent `Audio` element, src swapped per ayah — required for iOS Safari autoplay continuity.

## Product (complete)

**Part 1:** Prayer Times, Streak Tracker, 35 Sessions (7 categories), Duas Library (110 duas), Baby Names (1000), 99 Names of Allah, Daily Content, Tasbih, AI Companion, Onboarding

**Part 2:** Quran Reader (`/quran/read/:number`), 99 Names (`/99-names`), Qibla Compass, Masjid Finder (Leaflet map + GPS), Zakat Calculator, Islamic Calendar, Qurbani Guide, Farz Guide, Sadqa Guide, Wudu Guide, Salah Guide, Enhanced Duas/Names/Tasbih, Landing Page

**Part 3:** Push Notifications, Dashboard Bell/Search/Menu panels, Homepage SEO/GEO overhaul, Entity/trust pages (12), GEO landing pages (6), Start-here funnels (5)

## API routes

```
GET  /api/sessions              GET  /api/sessions/:id
GET  /api/duas                  POST /api/duas/:id/favorite
GET  /api/names                 GET  /api/names-of-allah
GET  /api/prayer/times          GET  /api/prayer/hijri
GET  /api/streak                POST /api/streak/checkin
GET  /api/masjid/nearby         GET|POST /api/masjid/favourite
GET  /api/zakat/gold-price
POST /api/notifications/subscribe    DELETE /api/notifications/subscribe
GET  /api/notifications/status       PATCH  /api/notifications/preferences
POST /api/notifications/test         GET    /api/notifications/vapid-public-key
POST /api/admin/duas/reseed     POST /api/admin/names/reseed
POST /api/admin/sessions/patch-audio
```

## Routes (all frontend pages)

```
/                   /login            /register         /onboarding
/home               /prayer-times     /duas             /names
/player/:id         /tasbih           /profile          /quran
/quran/read/:number /mood             /99-names         /qibla
/masjid-finder      /zakat-calculator /islamic-calendar /qurbani-guide
/farz-guide         /sadqa-guide      /wudu-guide       /salah-guide
/journal            /rooms            /room/:code       /growth
/halaqah            /halaqah/:code    /halaqah/:code/admin
/names/trending     /names/forbidden  /gift/:token
/subscribe          /download         /admin
```

## Design tokens

```css
--bg: #0d1411   --surface: #152019   --card: #1c2d21   --faint: #2a3830
--green: #34c97a   --gold: #b8946a   --text: #eaf4ee   --muted: #6a9878
--border: rgba(52,201,122,0.18)
```
Fonts: DM Sans (headings) | Inter (body/nav) | Amiri (Arabic, always `dir="rtl"`)

## User preferences

- **Always update `replit.md` and push to GitHub after every change.** Standing rule every session.
- **Changelog lives in `CHANGELOG.md`** — keep replit.md lean.
- GitHub repo: `https://github.com/InoxxAIsource/noor` (main branch)
