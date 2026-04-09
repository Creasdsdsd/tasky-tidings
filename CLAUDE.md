# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (port 8080)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Unit tests (Vitest + jsdom)
npm run test

# Unit tests in watch mode
npm test:watch

# Run a single test file
npx vitest run src/path/to/file.test.tsx
```

Playwright e2e tests use `playwright.config.ts` (configured via `lovable-agent-playwright-config`).

## Environment Variables

Create a `.env` file at the project root:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

The Supabase client at `src/integrations/supabase/client.ts` reads these at runtime.

## Architecture

This is a single-page React app (Vite + TypeScript) for "OK금융 업무 점검" — a personal compliance checklist tool with Google OAuth login.

### Auth flow

- `AuthProvider` (`src/contexts/AuthContext.tsx`) wraps the entire app and exposes `{ user, session, loading, signOut }` via `useAuth()`.
- Login is Google OAuth only, handled through `src/integrations/lovable/index.ts` (`lovable.auth.signInWithOAuth`), which bridges Lovable's cloud auth with the Supabase session.
- `src/pages/Index.tsx` renders `<LoginPage />` when `user` is null, otherwise renders the main checklist UI.

### Data layer

- All data lives in Supabase table `checklist_items` (columns: `id`, `title`, `category`, `checked`, `memo`, `sort_order`, `user_id`).
- Row-level security enforces user isolation — every query is implicitly scoped to `auth.uid() = user_id`.
- All Supabase queries are made directly from `src/pages/Index.tsx` (no separate service/hook layer). The typed client is imported from `@/integrations/supabase/client`.
- On first login, `seedDefaultItems` inserts 6 default checklist entries if the user has none.

### Component structure

`src/pages/Index.tsx` owns all state (`items`, `filter`, `collapsed`) and passes callbacks down to leaf components:

- `ChecklistCard` — single item card with inline memo (debounced 500ms write to Supabase)
- `ProgressHeader` — overall and per-category completion stats
- `FilterTabs` — "전체 / 완료 / 미완료" filter
- `AddItemForm` — form to add a new item
- `UserHeader` — displays logged-in user info and sign-out button
- `LoginPage` — Google OAuth entry point

### UI

- shadcn/ui components live in `src/components/ui/` (Radix UI primitives + Tailwind).
- Path alias `@/` maps to `src/`.
- `src/components/ui/` contains auto-generated shadcn components — prefer editing feature components over these.

### Database migrations

`supabase/migrations/` contains the full schema history. The final state:
- `checklist_items` table with RLS enabled
- Policies restrict all CRUD to `authenticated` users matching `user_id`
- `updated_at` auto-updated via trigger
