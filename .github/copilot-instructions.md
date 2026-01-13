# GitHub Copilot Instructions for D3 Advanced Visuals

## Quick orientation
- Purpose: Production-ready analytics dashboards built with Next.js (App Router v16), React 19, TypeScript, Tailwind v4 + CSS variables, and D3.js for visualizations.
- Entry points: UI routes live under `app/` (e.g., `app/page.tsx`, `app/fleet/page.tsx`). Components and charts are under `components/` and `charts/` respectively.
- Data source: `/data/**` JSON files are the authoritative example data and domain samples for dashboards (e.g., `data/fleet/vehicles.json`, `data/analytics/kpis.json`). Prefer using or extending these files for new examples and fixtures.

## How to run & validate changes (crucial)
- Dev server: `npm install` then `npm run dev` → open http://localhost:3000
- Build & type-check: `npm run build` (Next.js build runs TypeScript checks and static optimizations)
- Linting: `npm run lint` (ESLint configured via `eslint-config-next`)
- Notes: There are no automated tests or CI configs in the repo; confirm behavior locally with `dev` and `build` steps when changing rendering, routing, or TypeScript types.

## Project conventions & patterns (follow these precisely)
- File naming:
  - React components and charts: **PascalCase** (`LineChart.tsx`, `KPICard.tsx`).
  - Utilities and hooks: **camelCase** (`useD3.ts`, `scales.ts`).
  - Data files: lowercase JSON files inside `data/` (`fleet/vehicles.json`).
- Theme system:
  - Theme state uses a small Zustand store (`lib/theme.ts`) and is applied through `components/ThemeProvider.tsx` and `app/layout.tsx`.
  - Theme variables live in `app/globals.css` and are referenced with CSS variables (e.g., `--accent`, `--bg-primary`); update this file when adding color tokens.
- Chart patterns:
  - Reuse `useD3.ts` for D3 interactions. Charts accept `data`, `width`, `height`, and optional `animated` props—follow `LineChart.tsx` as canonical example.
  - Scale utilities are centralized in `lib/scales.ts`; prefer these helpers for consistent color/scale behavior.
- Component composition:
  - Small, themable components (e.g., `Card.tsx`, `PageHeader.tsx`) compose dashboards. Add new dashboards by creating a route under `app/<route>/page.tsx` and expose sample data under `data/`.

## Integration & cross-cutting concerns
- State management: Lightweight Zustand stores (no Redux). Check `lib/theme.ts` for pattern reference.
- Styling: Tailwind v4 + CSS variables — avoid global CSS overrides; add utilities and tokens to `app/globals.css` instead.
- Accessibility & responsiveness: Components are built mobile-first. Maintain semantic HTML and keyboard focus where applicable (tooltips, controls).

## When making changes, do this first
1. Run the dev server and reproduce the current behavior at the route you plan to change.
2. Reuse an existing chart/component as a template (`charts/LineChart.tsx` or `charts/BarChart.tsx`) rather than rewriting common logic.
3. Update or add sample data under `data/` to serve as reproducible examples. Small JSON fixtures are preferred for quick iteration.
4. Run `npm run build` to catch TypeScript/regression issues before opening a PR.

## Agent-specific behavior & heuristics
- Always scan `data/**` before answering domain or visualization questions — these files contain canonical example shapes.
- Prefer minimal, targeted diffs over full-file rewrites unless a large refactor is explicitly requested.
- Use `LineChart.tsx` and `KPICard.tsx` as canonical examples for chart props, animation, and theming.
- If a requested change touches global theming (colors, variables), update `app/globals.css` and `components/ThemeProvider.tsx` together.
- If new runtime or build scripts are needed, discuss in an issue/PR—do not unilaterally change package.json scripts without maintainers’ review.

## Files to inspect first for feature work or debugging
- `app/layout.tsx` — Root layout & ThemeProvider (routing & global wrappers)
- `app/page.tsx` and other `app/*/page.tsx` — Dashboard entry points
- `charts/*` — Chart implementations
- `components/*` — Shared UI building blocks (Topbar, Sidebar, Card)
- `lib/useD3.ts` & `lib/scales.ts` — D3 hooks and scale helpers
- `data/**` — Example datasets and fixtures

---
If anything is unclear or you want richer examples (e.g., a step-by-step sample PR for adding a chart), tell me which sections to expand or which code paths you'd like included as inline snippets. ✅