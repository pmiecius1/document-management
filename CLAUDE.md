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

# Persistence

- Dexie.js (IndexedDB) is the persistence layer — defined in `lib/db.ts`.
- All document data lives in the browser; there is no server and no API calls.

# Git workflow

- One branch per feature → PR → merge → delete branch.
- Branch name matches the feature (e.g. `dark-mode-toggle`, `starred-documents`).
