# FPL Studio

FPL Studio is a modern, front-end-focused Fantasy Premier League (FPL) companion app. It provides an interactive, data-driven interface for FPL managers to analyze fixtures, track difficulty, and (eventually) manage their teams or leagues. It started as an experimental fixture difficulty planner and aims to expand into visualizations, team-based tools, and possibly real-time match integrations.

**Live site:**  
[https://fpl-studio.vercel.app/](https://fpl-studio.vercel.app/)

## Features

- Dynamic, responsive fixture difficulty grid (with color-coded backgrounds)
- Supports double and triple gameweeks (DGW/TGW)
- Fixture difficulty coloring with average per team
- Filter by number of gameweeks (dynamic range)
- Sticky left column and horizontal scroll
- Dark/light mode toggle (SSR compatible)
- Gameweek filter via Select component
- Optimized for hydration and SSR rendering
- Built with clean, accessible UI using `shadcn/ui`

## Planned Improvements / Roadmap

- Tooltip or click-based fixture detail (show date, score, difficulty)
- Sorting teams by average fixture difficulty
- Refined difficulty model (e.g. based on form, xG, ELO, possibly AI-enhanced)
- Visualizations using charts (trendlines, difficulty runs, bar/line charts)
- Add fixture filters (team, difficulty range, home/away toggle)
- User team viewer and planner (with possible auth for tracking/minileagues)
- Split planner vs results UI (if match data is shown)
- Add favicon, Open Graph, PWA manifest
- Build towards a public-facing site with better mobile-first design and modern UX/UI

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (custom color variables, dark mode)
- **Component Library:** shadcn/ui
- **State/Theming:** next-themes with custom `<ThemeToggle />`
- **TypeScript:** Strict mode
- **Linting:** ESLint + Prettier (Airbnb-inspired)
- **FPL Data:** [FPL API](https://fantasy.premierleague.com/api/bootstrap-static/) and fixtures
- **UI Components:** [Radix UI](https://www.radix-ui.com/)

## Installation / Getting Started

1. **Clone the repository**

    ```bash
    git clone https://github.com/revilo1882/fpl-studio.git
    cd fpl-studio
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment

No environment variables are required.

If any are added later (e.g. for proxying APIs or auth), they will be documented in an `.env.example`.

## Project Structure

```txt
/app
  page.tsx                 ← server-side data fetch
/components
  FixtureGrid.tsx          ← presentational table
  FixtureGridPage.tsx      ← client wrapper with filters
  ThemeToggle.tsx
/lib
  fplApi.ts                ← FPL data fetching utils
  generateFixtureMatrix.ts ← builds fixture display data
/types
  fpl.ts                   ← FPL API types
/styles
  globals.css              ← Tailwind base + custom theme vars
```

## Design Decisions

- Using `theme === undefined` logic in `<ThemeToggle />` to avoid hydration mismatch
- All data fetching is on the server via Next.js App Router
- `<FixtureGrid />` is fully client-side for interactivity
- `darkMode: 'class'` in tailwind.config.js
- No .env required (FPL API is public)

## Known Issues

- Currently showing last season's fixtures (pre-season updates pending)
- Next GW logic relies on `events.find((e) => e.is_current)` which is falsy until the season starts

## Repository Status

- Project is now stable and working
- .gitignore and structure cleaned
- Ready for first commit and GitHub repository

## License

MIT

This is currently a personal project. Issues and PRs are welcome but not expected at this time.
