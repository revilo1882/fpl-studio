# FPL Studio

An interactive fixture difficulty planner for Fantasy Premier League managers.

## Features

- Dynamic fixture grid using live FPL data
- Supports double and triple gameweeks (DGW/TGW)
- Fixture difficulty coloring with average per team
- Filter by number of gameweeks (dynamic range)
- Sticky team name column with horizontal scroll
- Responsive table layout and dark mode support
- Built with clean, accessible UI using `shadcn/ui`

## Planned Improvements

- Tooltip or click-based fixture detail (show date, score, difficulty)
- Sorting teams by average fixture difficulty
- Refined difficulty model (e.g. based on form, xG, ELO)
- Visualizations using charts (trendlines, difficulty runs)
- Possibly user team viewer and planner

## Getting Started

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Stack

- [Next.js (App Router)](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- TypeScript

## Theme

Dark mode is powered by [`next-themes`](https://github.com/pacocoursey/next-themes), configured with Tailwind’s `darkMode: 'class'`.

- Theme is applied via `class` on `<html>`
- Default theme follows system preference
- Users can toggle between light and dark
- Transitions are disabled on theme change for smoother UX

## Environment

No environment variables are required.

If any are added later (e.g. for proxying APIs or auth), they will be documented in an `.env.example`.

## Folder Structure (simplified)

```
/app
  page.tsx                 ← server-side data fetch
/components
  FixtureGrid.tsx          ← presentational table
  FixtureGridPage.tsx      ← client wrapper with filters
  DarkModeToggle.tsx
/lib
  fplApi.ts                ← FPL data fetching utils
  generateFixtureMatrix.ts ← builds fixture display data
/types
  fpl.ts                   ← FPL API types
```

## License

[MIT](LICENSE)
