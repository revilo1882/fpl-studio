# FPL Studio

A Next.js app for **Fantasy Premier League** transfer planning: a **custom fixture difficulty rating (FDR)** on a 1–5 scale, built from official API data plus season performance, form, and dynamic weighting by gameweek.

**Live site:** [fpl-studio.vercel.app](https://fpl-studio.vercel.app/)

---

## Features

- **Fixture difficulty (`/fixtures`)** — Sortable grid of all teams across a chosen gameweek window; switch **Overall / Attack / Defence** views; optional **FPL** difficulty mode vs **Studio** ratings. **Chart** view for up to five selected teams. Difficulty colour legend; fixture detail popovers (hover on desktop). URL query params keep filters shareable.
- **Team pages (`/team/[slug]`)** — Per-team FDR snapshot, fixtures vs results (matches), opponent links, and PL badge assets.
- **Strengths snapshot (`/strengths`)** — Sortable table of **raw FPL strength fields** (1000–1400 scale + FPL’s summary strength); same inputs feed the FDR base layer.
- **Landing page (`/`)** — Product overview and how the model combines factors.
- **App shell** — Sticky header, active route styling, light/dark theme, responsive navigation (including mobile menu).

---

## How the FDR model works (summary)

1. **Base layer** — The six FPL strength metrics (overall, attack, defence × home/away) are linearly mapped from the API’s ~1000–1400 range to **1–5** (clamped). Attack/defence difficulty uses the relevant opponent strengths for the fixture context.
2. **Season performance** — Adjustments from actual vs expected performance (e.g. points per game, goal difference), weighted by how much of the season has been played.
3. **Form** — Last five fixtures with recency weighting and opponent-aware context.
4. **Home advantage** — Small fixed correction, scaled by the active weights.
5. **Dynamic weights** — Early season leans on base strength; later in the season, season stats carry more weight (see `src/lib/fdr/weights.ts` and related modules).
6. **Confidence** — Intervals and a confidence score reflect sample size, gameweek, and size of adjustments.

Implementation lives under `src/lib/fdr/` (e.g. `dynamicFDR.ts`, `confidence.ts`, `formAnalysis.ts`, `seasonPerformance.ts`).

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | **Next.js 16** (App Router), **React 19** |
| Language | **TypeScript** |
| Styling | **Tailwind CSS**, **shadcn/ui** (Radix primitives) |
| Charts | **Chart.js** + **react-chartjs-2** (client-only chart route) |
| Theming | **next-themes** |
| Tests | **Vitest**, **React Testing Library**, **happy-dom** |
| Tooling | ESLint, Prettier, Husky (pre-commit runs tests) |

---

## Project structure

```text
src/
  app/
    page.tsx                 # Landing
    fixtures/page.tsx        # Fixture grid + chart (FPL data via HOC)
    strengths/               # Raw strengths table
    team/[slug]/             # Team detail + tabbed matches
    layout.tsx               # Theme + FPL provider + header
  components/                # Feature UI (grid, controls, charts, etc.)
    charts/
    ui/                      # shadcn components
  contexts/                  # FPL server / client data context
  hooks/                     # Table state, URL sync
  lib/
    fdr/                     # FDR algorithms
    fpl/                     # API helpers, badge URLs
    generateFixtureMatrix.ts # Matrix + memoised difficulty cells
  tests/                     # Vitest setup
  types/                     # FPL / bootstrap types
```

---

## Data & caching

- **Source:** [Official FPL HTTP API](https://fantasy.premierleague.com/api/) (`bootstrap-static`, fixtures, etc.).
- Fetch helper: `src/lib/fplApi.ts` (`fetchFPLData`) — revalidation / `no-store` where needed for large payloads and Next.js cache limits.
- Heavy **client-side** work: fixture matrix and FDR for cells are computed in the browser; memoisation reduces repeat work when filters change.

Optional env vars — see `.env.example` (`NEXT_PUBLIC_REVALIDATE_SECONDS`, etc.).

---

## Scripts

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # runs vitest then next build
pnpm test         # vitest watch
pnpm test:coverage
pnpm lint
pnpm format
```

**Node:** `package.json` lists `engines.node` as `>=22 <23`; newer Node versions often work but may show a warning from tooling.

---

## Testing

Vitest + Testing Library cover **hooks** (`useFplTable`), **FDR-related utilities**, **fixture matrix / grid utils**, **FPL fetch behaviour**, and **selected UI** (e.g. header, nav, fixture chip, selectors, strengths table, chart empty states, team badge). Run `pnpm test` before pushing; Husky runs tests on commit.

---

## Roadmap ideas (not scheduled)

- Player-level views and transfer planning
- Exports (CSV / chart image)
- Favicon and further branding polish

---

## Licence

Private / personal project unless you add an explicit licence.
