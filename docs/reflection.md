# Reflection

## 1. The persistence consultation
I asked Claude Code which storage mechanism would work for a single-user, no-backend, localhost-only app. It recommended IndexedDB wrapped with Dexie.js. The alternatives it surfaced were: localStorage (5 MB cap, strings only), sessionStorage (lost on tab close), cookies (designed for small tokens, redundant without a server), in-memory React state (lost on every reload), and a server-side database (ruled out by the no-backend constraint). IndexedDB was the only option that cleared all three project constraints — no meaningful size limit, survives sessions, entirely client-side, stores structured objects natively. The reasoning was clear enough that there was nothing to debate; every alternative failed on at least one hard constraint.

## 2. Search → paste → cite


## 3. CLAUDE.md catching drift
I did not notice a clear instance of CLAUDE.md catching the agent mid-session. Its most useful role was preventative: having the constraints (single user, no backend, localhost only) documented meant the agent never suggested adding authentication, API routes, or a hosted deployment. The absence of drift may itself be evidence that documenting constraints upfront works.

## 4. The design pass
The direction I gave Claude Code was: text size and text colour across the app must meet accessibility standards; the dark theme toggle needs to be bigger and easy to spot; all buttons need to be big enough and easy to spot; the colour scheme must meet accessibility standards — and I asked it to suggest any further changes needed for full compliance. The scaffolded default was a pure zinc monochrome palette where interactive elements were visually indistinct from static content. The agent audited every component and identified failing contrast pairs, undersized touch targets (the toggle and star/delete buttons were below the 44×44 px minimum), missing focus indicators, and a modal with no keyboard handling. The change that finally felt right was introducing indigo as a primary accent colour — buttons, active states, and links gained a consistent visual identity without altering the app's overall neutral tone.

## 5. Harder than expected
Context engineering for Next.js was harder than the static-site lesson. With plain HTML there is nothing to look up. With Next.js, when things broke — dark mode, hydration mismatches, async params — I did not always know which part of the documentation to read before prompting. I am still learning to predict which concepts the agent needs before it runs into problems, rather than working backwards from an error.

## 6. Docs folder
The persistence decision rationale was genuinely useful — having the reasoning written down made the choice feel grounded. The risk register was good to write as a thinking exercise but I never referred back to it during development. Next time I would keep decision rationale, skip risks unless they are actively shaping implementation choices.
