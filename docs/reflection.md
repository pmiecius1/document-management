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
