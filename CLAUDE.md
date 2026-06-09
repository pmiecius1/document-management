@AGENTS.md

# Project

A document management app. Work in progress.

# Constraints

- Single user — no auth, no multi-tenancy
- No backend — no database, no server-side API
- No hosted environment — runs on localhost only

# Stack

Next.js (App Router)
TypeScript
Tailwind CSS

# Running locally

```
npm run dev
```

Dev server defaults to port 3000. If that port is taken, Next.js moves to the next free port (3001, etc.) — check terminal output for the exact URL.

# Project structure

- `app/` — all pages and UI. Each subfolder with a `page.tsx` becomes a route.
- `app/layout.tsx` — root shell wrapping every page (nav, fonts, global providers go here).
- `app/globals.css` — global styles.
- `public/` — static assets served at `/`.
- API routes: add a `route.ts` inside any `app/` subfolder (e.g. `app/api/documents/route.ts`).

# Conventions

- Use `.tsx` for files with JSX, `.ts` for everything else.
- Style with Tailwind utility classes directly on elements — avoid separate CSS files unless necessary.
- Keep components co-located with the route that uses them unless they are shared across multiple routes.
