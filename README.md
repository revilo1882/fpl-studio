# FPL Studio

FPL Studio is a modern, front-end-focused Fantasy Premier League (FPL) companion app. It provides a fast, interactive, and intelligent fixture planner designed to offer a superior alternative to existing tools.

The key differentiator is a more nuanced and customizable Fixture Difficulty Rating (FDR) system, with plans to evolve into a player-centric "Expected Points" (xP) model.

**Live site:** [https://fpl-studio.vercel.app/](https://fpl-studio.vercel.app/)

## Implemented Features

- **Interactive Fixture Grid:** A fully responsive grid displaying FPL fixtures for all teams, correctly handling Single, Double, and even Triple Gameweeks (DGW/TGW) with clean, aligned rows.
- **Custom FDR "Studio" Views:** In addition to the default FPL difficulty, users can switch between three custom views:
    - **Studio Overall:** Based on the opponent's overall FPL strength rating.
    - **Studio Attack:** Based on the opponent's defensive FPL strength rating.
    - **Studio Defence:** Based on the opponent's attacking FPL strength rating.
- **Intelligent "Attractiveness Score":** A calculated score for a team's fixture run that correctly values the high potential of Double Gameweeks, providing a smarter assessment than a simple average.
- **Dynamic UI Controls:**
    - Multi-select team filter to show only specific teams.
    - Dropdown to switch between the four FDR models.
    - Dropdown to select the number of future gameweeks to display.
- **Polished UI/UX:** Built with `shadcn/ui`, featuring a dark/light mode toggle and a robust layout with no content shifting on filtering or selection.

## Roadmap & Vision

The primary goal is to build the most intelligent and intuitive FPL fixture planner available. The immediate roadmap is focused on enhancing data visualization and predictive modeling.

1.  **Refine Scoring / Introduce Player xP Model:** Evolve the current "Attractiveness Score" into a player-specific "Expected Points" (xP) model. This will involve integrating external data sources (e.g., for xG/xA stats) to create a more accurate predictive tool.
2.  **Fixture Tooltips:** Add hover-based tooltips on each fixture to show detailed information (date, time, exact difficulty rating).
3.  **Graph View:** Implement a data visualization view to chart and compare fixture difficulty or xP for selected teams/players over a range of gameweeks.
4.  **Home/Away Toggle:** Add a filter to show only home or away fixtures.
5.  **Fixture-Run Highlighting:** Visually highlight the best and worst fixture runs directly in the grid based on the selected scoring model.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict)
- **Styling:** Tailwind CSS with CSS Variables
- **Component Library:** shadcn/ui (built on Radix UI)
- **Testing:** Vitest with React Testing Library
- **Data Parsing:** PapaParse (for handling CSV data)
- **State/Theming:** next-themes
- **Linting:** ESLint + Prettier

## Project Structure

```txt
/app
  page.tsx                 ← Server-side data fetching and composition.
/components
  FixtureGrid.tsx          ← The main presentational table component.
  FixtureGridPage.tsx      ← Client-side wrapper for all interactivity.
  DifficultySelector.tsx   ← Dropdown for switching FDR views.
  GameweekSelector.tsx     ← Dropdown for selecting GW range.
  TeamFilter.tsx           ← Multi-select dropdown for filtering teams.
/hooks
  useFplTable.ts           ← Core client-side hook for state management, filtering, and sorting.
/lib
  generateFixtureMatrix.ts ← Core data transformation logic.
  fplApi.ts                ← Utils for fetching data from FPL API or other sources.
/types
  fpl.ts                   ← TypeScript definitions for FPL API data.
```

## Key Decisions

- **Data Strategy:** The app uses the live, official FPL API for real-time data. A flexible data fetching layer has been built to allow for using historical data from community sources (like the `vaastav/Fantasy-Premier-League` repo) for testing and future features.
- **Scoring Model:** The current "Studio" FDR models normalize the FPL API's detailed strength ratings (1000-1400) to a more granular 1-5 scale. The "Attractiveness Score" uses a multiplier-based sum to properly value DGWs.
- **UI Stability:** All identified layout shifts have been resolved to ensure a smooth, professional user experience, particularly when interacting with dropdowns and filters.

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/revilo1882/fpl-studio.git](https://github.com/revilo1882/fpl-studio.git)
    cd fpl-studio
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  Open http://localhost:3000 in your browser.

## License

MIT
