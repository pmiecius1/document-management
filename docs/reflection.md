# Reflection

## 1. The persistence consultation
I asked Claude Code which storage mechanism would work for a single-user, no-backend, localhost-only app. It recommended IndexedDB wrapped with Dexie.js. The alternatives it surfaced were: localStorage (5 MB cap, strings only), sessionStorage (lost on tab close), cookies (designed for small tokens, redundant without a server), in-memory React state (lost on every reload), and a server-side database (ruled out by the no-backend constraint). IndexedDB was the only option that cleared all three project constraints — no meaningful size limit, survives sessions, entirely client-side, stores structured objects natively. The reasoning was clear enough that there was nothing to debate; every alternative failed on at least one hard constraint.

## 2. Search → paste → cite
The clearest example came during dark mode setup. The toggle was calling `setTheme("dark")` correctly and next-themes was adding `class="dark"` to `<html>`, but nothing changed visually. Rather than describing the symptom, I asked Claude Code to inspect the compiled output at `.next/dev/static/chunks/`. The compiled CSS confirmed that all `dark:` utilities were wrapped in `@media (prefers-color-scheme: dark)` — the class selector was never generated. That concrete evidence changed the outcome: instead of continuing to adjust the `@custom-variant dark` syntax, the agent switched approach entirely and identified that adding `tailwind.config.ts` with `darkMode: "class"` was the correct fix for Tailwind v4.

## 3. CLAUDE.md catching drift
I did not notice a clear instance of CLAUDE.md catching the agent mid-session. Its most useful role was preventative: having the constraints (single user, no backend, localhost only) documented meant the agent never suggested adding authentication, API routes, or a hosted deployment. The absence of drift may itself be evidence that documenting constraints upfront works.

## 4. The design pass
The direction I gave was entirely accessibility-driven: meet WCAG 2.1 AA. I specified minimum 44×44 px touch targets, readable contrast ratios for placeholder and secondary text, a larger and more prominent dark mode toggle, and visible focus indicators on every interactive element. The scaffolded default was a pure zinc monochrome palette where interactive elements were visually indistinct from static content. The change that finally felt right was introducing indigo as a primary accent colour — buttons, active states, and links now have a consistent visual identity without altering the app's overall neutral tone.

## 5. Harder than expected
Context engineering for Next.js was harder than the static-site lesson. With plain HTML there is nothing to look up. With Next.js, when things broke — dark mode, hydration mismatches, async params — I did not always know which part of the documentation to read before prompting. I am still learning to predict which concepts the agent needs before it runs into problems, rather than working backwards from an error.

## 6. Docs folder
The persistence decision rationale was genuinely useful — having the reasoning written down made the choice feel grounded. The risk register was good to write as a thinking exercise but I never referred back to it during development. Next time I would keep decision rationale, skip risks unless they are actively shaping implementation choices.
