# Noor — Islamic Prayer & Spirituality App

A full-stack Islamic spirituality PWA. "Remember Allah. Every day." A personal companion for daily salah, dhikr, duas, Quran reflection, and spiritual growth.

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
- **JWT in localStorage**: Token stored as `noor_token`. Custom fetch in `lib/api-client-react/src/custom-fetch.ts` reads it automatically on every request.
- **Seed on startup**: API server seeds all content (sessions, duas, names, hadiths) on first boot if DB is empty.
- **AI rate limit**: 20 AI requests per user per day, tracked in `aiUsage:{userId}:{date}`.

## Product

- Prayer Times: Live prayer times via aladhan.com API, salah logging with khushoo rating
- Streak Tracker: Daily streaks, weekly goals, progress rings
- Sessions: 25 guided audio sessions across AZKAR, QURAN, DHIKR, SLEEP, DUA60, SALAH categories
- Duas Library: 25 curated duas with Arabic, transliteration, meaning, category filtering, favorites
- Baby Names: 40 Islamic names with Arabic, meaning, origin, prophet connection, gender filter
- Names of Allah: All 99 names with Arabic, transliteration, meaning, daily rotation
- Daily Content: Name of Allah + Hadith + Dua of the day (rotates daily by day-of-year)
- Tasbih: Digital dhikr counter (SubhanAllah / Alhamdulillah / Allahu Akbar)
- AI Companion: Noor AI powered by Claude, 20 req/day limit, Islamic adab guidelines
- Onboarding: 5-step wizard (madhab, city/GPS, goals, language, reminder time)

## Design tokens

```css
--bg: #001a00  --surface: #002800  --card: #003800
--green: #00a550  --gold: #ffd700  --text: #e8f5e8
--muted: #4a7a4a  --border: rgba(0,165,80,0.18)
```
Fonts: Cinzel (headings/logo) | Amiri (Arabic, always rtl) | system-ui (body/nav)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `@replit/database` v3: `db.get()` / `db.list()` return `{ ok, value }` — use the `dbGet`/`dbList` wrappers in `db.ts`, never call `db.get()` directly in routes.
- `useGetSession(id, options)` — first param is string ID, not an object.
- All generated query hooks require `queryKey` in options if you pass a custom `query` option — use the exported `getGet*QueryKey()` helpers.
- Never call services directly by port. Always use `localhost:80/<path>` through the shared proxy.
- Seed data is written to @replit/database on first boot only (checks if DB is empty first).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
