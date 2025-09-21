## Repo overview

This is a small Next.js (app directory) project scaffolded from the official template and using Tailwind CSS. Key facts:

- Framework: `next` (App Router, React 19). See `package.json`.
- Styles: Tailwind CSS is used via `src/app/globals.css` (imported in `src/app/layout.tsx`).
- Fonts: Google fonts loaded via `next/font/google` in `src/app/layout.tsx`.

Primary entry points to inspect:

- `src/app/layout.tsx` — global layout, font and css imports, metadata
- `src/app/page.tsx` — home page component and examples of `next/image` usage
- `public/` — static assets referenced by code (SVGs)

Build, dev and lint commands

- Start dev server: `pnpm|npm|yarn dev` runs `next dev --turbopack` (see `package.json`). Use whichever package manager the project uses.
- Build for production: `npm run build` → `next build --turbopack`.
- Start production server (after build): `npm run start` → `next start`.
- Lint: `npm run lint` (runs `eslint`).

Project-specific patterns and conventions

- App Router: this repo uses the new Next.js App Router. Files under `src/app` are route segments. Keep server and client components semantics in mind.
- Fonts: fonts are imported using the `next/font` helpers and attached to the `body` via CSS variables (see `layout.tsx`). When adding fonts follow that pattern.
- Images: `next/image` is used with static `public/` assets (e.g. `/next.svg`). Prefer using `public/` for static assets referenced by `next/image`.
- Typescript: `tsconfig.json` uses path alias `@internal/*` → `./src/*`. Use `@internal/...` for intra-repo imports when beneficial.

Integration points and external dependencies

- Vercel-oriented: The template includes links and Vercel deployment hints (not required, but expected). The app is compatible with Vercel deployments.
- No server APIs or external services are present in the scaffold. If you add APIs, follow Next.js App Router conventions (`src/app/api/...` with server-only handlers).

What an AI agent should do first (concrete tasks)

1. Run lint and dev server locally to validate the environment: `npm run lint` and `npm run dev`.
2. Inspect `src/app/layout.tsx` for global styles and any changes to CSS variables or fonts before editing pages.
3. When adding routes, create a folder under `src/app` with a `page.tsx` (or `page.ts`) file.

Coding style hints (project-specific)

- Prefer React Server Components in `src/app` route files unless you need client-side state or effects — then add `'use client'` at the top of the file.
- Keep utility CSS classes in Tailwind config or `globals.css` rather than adding one-off styles in components.
- Follow existing TS strictness — `tsconfig` has `strict: true` and `noEmit: true`.

Files to reference for behaviour/examples

- `src/app/layout.tsx` — global imports, font setup, and metadata example.
- `src/app/page.tsx` — example usage of `next/image`, Tailwind classes, and static asset links in `public/`.
- `package.json`, `tsconfig.json` — commands and TypeScript rules.

Limitations for the agent

- There are no tests or CI configuration in this scaffold — do not assume test harnesses exist.
- Do not modify `next.config.ts` unless needed for explicit features (image domains, rewrites). It's minimal now.

If you need to make changes, prefer small, well-scoped commits and include the rationale (e.g., "add API route for X; follow App Router conventions").

Questions for the maintainer

- Which package manager is preferred (npm/pnpm/yarn)?
- Any Tailwind custom configuration or additional PostCSS plugins expected beyond the defaults?

---

If you'd like I can merge this with an existing `.github/copilot-instructions.md` (if one exists elsewhere) or expand the file to include more examples (e.g., adding a sample API route and tests).
