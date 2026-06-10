# Persistence Strategy: IndexedDB

## Project Constraints

- Single user — no auth, no multi-tenancy
- No backend — no database, no server-side API
- No hosted environment — runs on localhost only

---

## Why IndexedDB

This app is single-user, has no backend, and runs on localhost only. IndexedDB is the only browser-native storage mechanism that satisfies all three constraints without compromise:

- No practical storage limit — handles a document app's worth of data without hitting a cap
- Persists between sessions — survives tab and browser close/reopen
- Entirely client-side — no server, no accounts, no network required
- Stores JavaScript objects directly — no need to serialise everything to strings

The raw browser API is verbose, so Dexie.js will be used as a lightweight wrapper to keep the code clean.

---

## Risks to address in this project

### High priority

**Accidental data loss from clearing browser storage**
IndexedDB is wiped if the user clears browser/site data. There is no recovery.
Mitigation: build an export-to-file feature so documents can be saved to disk as a manual backup.

**Schema changes breaking saved data**
As the app evolves, old documents stored under a previous data structure may not match what new code expects.
Mitigation: version the schema from day one and write migration logic for every structural change. Dexie.js handles this with its `version()` API.

### Medium priority

**Storage eviction under browser pressure**
Browsers can silently delete IndexedDB data if storage is classified as best-effort rather than persistent.
Mitigation: call `StorageManager.persist()` on first load to request persistent storage from the browser.

### Low priority (address as the app matures)

**No undo on destructive actions**
Deleted or overwritten documents cannot be recovered without an explicit undo mechanism.
Mitigation: implement soft deletes (flag as deleted, don't remove) or maintain a simple version history per document.

---

## Accepted limitations

Data is tied to one browser on one machine. It will not appear in another browser or on another device. Given the localhost-only, single-user constraints of this project, this is acceptable and does not need to be mitigated.

---

# Accessibility Pass (PR #11)

## Prompts and process

PR #11 was built through an iterative series of prompts. The first prompt asked for WCAG 2.1 AA compliance across text size, text colour, button size, the dark mode toggle, and the overall colour scheme, and also invited suggestions for additional improvements. A follow-up clarified that mobile view should be covered too, which led to a fix for the delete button being permanently invisible on touch devices (hover-only visibility does not work on mobile). A second round addressed placeholder text contrast after the "Start writing…" hint was identified as near-invisible at zinc-300 (~2:1 contrast ratio). A final prompt requested a full colour scheme update, which produced the indigo accent system.

## Design decisions

The main design decisions were: adopting WCAG 2.1 AA as the compliance target; using a single global `focus-visible` rule rather than per-element focus styles; setting 44×44 px as the minimum touch target for all interactive controls; and introducing indigo as a primary accent colour to replace the all-zinc monochrome palette. The indigo choice was driven by WCAG 1.4.1 (use of colour) — without a distinct hue, interactive elements were indistinguishable from static content by colour alone. Zinc was kept for structural chrome, amber for starred documents, and red for destructive actions, preserving existing semantic meaning while giving interactive elements a clear visual identity.
