---
name: doc-app-feature
description: >-
  Build or extend a feature in this single-user, no-backend document management
  app (the two-pane workspace at /docs, the Markdown editor, the sidebar, and
  anything that reads or writes documents). Use this whenever the user asks to
  add, change, or wire up app behaviour — for example tags, export/import,
  document history, soft delete / trash, a Cmd+K command palette, folders,
  word count, starred docs, search tweaks, new routes under /docs, or any
  change that touches stored document data — even when they describe the
  outcome in plain language and never mention Next.js, Dexie, or IndexedDB.
  It captures the project's actual conventions (Dexie persistence in lib/db.ts,
  App Router file layout, the Tailwind palette, and the one-branch-per-feature
  workflow) so the change lands consistent with the existing code instead of
  reinventing patterns.
---

# Building a feature in this document app

This app is a single-user, browser-only document workspace. There is **no
backend, no API, and no auth** — every constraint below follows from that.
Before writing code, read this whole file; it tells you where things live and
the patterns the existing code already commits to, so a new feature looks like
it was always there.

## Read the bundled Next.js docs first

Per `AGENTS.md`, this is **not** the Next.js in your training data — APIs and
file conventions may differ. Before writing any routing, layout, server/client
component, or data-fetching code, read the relevant guide under
`node_modules/next/dist/docs/` and follow it (and any deprecation notices)
rather than relying on memory. This is the single most common source of
drift on this project.

## Persistence: Dexie (IndexedDB), never a server

All document data lives in the browser via Dexie, defined in `lib/db.ts` and
imported as `@/lib/db`. There is no fetch, no route handler, no database
server — do not add one.

The `Document` shape and schema live in `lib/db.ts`:

```ts
export interface Document {
  id: number;
  title: string;
  content: string;
  starred: boolean;
  updatedAt: number;   // ms epoch; bump on every write
  createdAt: number;
}
```

**Adding a field** (e.g. `tags`, `folderId`, `deletedAt`): extend the
interface, then add a **new** `db.version(N).stores(...)` migration — never
edit an existing version block, since users have data under the old schema.
Only index a column in the `stores` string if you query or sort by it; plain
fields don't need indexing. Example for a tags feature:

```ts
// Version 3: adds tags
db.version(3).stores({
  documents: "++id, updatedAt, starred, *tags",
});
```

(`*tags` is a multi-entry index — use it when filtering by individual tag.)

## Reading and writing documents

- **Reactive reads** in client components use `useLiveQuery` from
  `dexie-react-hooks`. It re-renders automatically on any write — there is no
  manual refresh. While the query is still resolving it returns `undefined`;
  branch on that for loading state (see `app/docs/Sidebar.tsx`).
- **Writes** are `db.documents.add` / `.update` / `.delete`, awaited in an
  `async` handler. Every write that changes content must set
  `updatedAt: Date.now()` so the sidebar's "most recently updated" sort and
  autosave stay correct.
- The sort order the sidebar relies on is
  `db.documents.orderBy("updatedAt").reverse()`, with starred docs floated to
  the top in a `.sort()` after the live query.

## Routing and components (App Router)

```
app/
  page.tsx              home (/)
  layout.tsx            root layout
  docs/
    layout.tsx          two-pane shell: <Sidebar/> + content slot
    page.tsx            /docs empty state ("No document open")
    Sidebar.tsx         document list, search, new/delete/star
    [id]/
      page.tsx          /docs/:id — looks up the doc, 404s if missing
      Editor.tsx        title + Markdown body, autosave
      EditorClient.tsx  client wrapper
```

- Anything using hooks, Dexie, or browser APIs must start with `"use client"`.
- A new screen is a new folder with a `page.tsx`; a new document sub-route is a
  folder under `app/docs/[id]/`. Don't hand-configure routes.
- Missing documents must render a readable "Document not found" state with a
  link back to `/docs`, matching requirement 7 — don't throw or show a blank.

## Empty states and keyboard flow are requirements, not polish

- Every list/search/content area needs a readable empty state — no blank
  screens when there are zero documents or zero search results (see the two
  branches in `Sidebar.tsx`).
- Keyboard-first matters: e.g. pressing Enter in the title field jumps to the
  body. New features should preserve mouse-free operation where it's natural.

## Styling

Tailwind utility classes inline, matching the existing palette: `zinc` for
neutrals, `indigo` for primary actions, `amber` for stars, `red` for
destructive actions. Always pair light classes with a `dark:` variant — the
app has a working dark mode (`ThemeProvider` / `ThemeToggle`). Reuse the
spacing, radius (`rounded-md` / `rounded-xl`), and border conventions already
in `Sidebar.tsx` rather than introducing new ones. Tap targets that matter on
mobile use `min-h-[44px] min-w-[44px]`.

## Workflow

Per `CLAUDE.md`: **one branch per feature → PR → merge → delete branch**, with
a branch name that matches the feature (e.g. `tags`, `export-import`,
`command-palette`). Build one feature at a time and commit at each stable
state; don't bundle unrelated changes. Verify locally with `npm run dev`
(port 3000, or the next free port) before considering it done.

## Quick checklist before finishing a feature

- [ ] Read the relevant `node_modules/next/dist/docs/` guide before routing/component work
- [ ] Schema change done as a new `db.version(N)` block, interface updated
- [ ] `updatedAt` bumped on every content write
- [ ] Reactive reads via `useLiveQuery`; `"use client"` where needed
- [ ] Readable empty/not-found states, no blank screens
- [ ] Light + `dark:` classes, palette consistent with `Sidebar.tsx`
- [ ] On its own feature branch, verified with `npm run dev`
