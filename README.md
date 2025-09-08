# FPL Studio – Fixture Difficulty Calculator

A modern FPL tool for exploring **fixture difficulty ratings (FDR)** with custom calculations, visualizations, and planning tools.
Hosted on **Vercel**: [https://fpl-studio.vercel.app/](https://fpl-studio.vercel.app/)

---

## ✨ Features

- **Custom Fixture Difficulty**
    - Overall, Attack, Defence difficulty views.
    - Handles **Double Gameweeks** with aggregate attractiveness scoring.
    - Confidence rating attached to every FDR score.

- **Interactive Views**
    - **Fixture Grid**: upcoming fixtures for all teams.
    - **Charts**: fixture attractiveness trends across teams, built with **Chart.js**.
    - Filters: teams, difficulty view (FPL default / Overall / Attack / Defence), number of gameweeks.
    - URL query string persistence → filters and state are shareable.

- **Team Pages**
    - Per-team route (`/team/[slug]`).
    - Snapshot metrics (Overall, Attack, Defence) with confidence.
    - Trend line charts.
    - Fixtures + results with DGW/blank indicators.

- **Coming Soon**
    - **Player Pages**: ownership %, form, fixtures overlayed with FDR.
    - **Transfer Planner (MVP)**: local squad builder, fixture-weighted projections, “what if” transfers.
    - **Export & Sharing**: CSV for grid, PNG for charts.
    - **Homepage & Branding**: landing page, logo, favicon.

---

## 🧮 Fixture Difficulty Methodology

### 1) Base Normalization

Uses all **6 FPL strength metrics** (overall/attack/defence × home/away) with intelligent normalization:

```typescript
function normalizeStrengthToDifficulty(strength: number): number {
	const minStrength = 1000
	const maxStrength = 1400
	const clampedStrength = Math.max(minStrength, Math.min(maxStrength, strength))
	return 1 + (4 * (clampedStrength - minStrength)) / (maxStrength - minStrength)
}
```

### 2) Season Performance Integration

Compares actual performance vs expected based on FPL strength:

- **Points per game** vs league-adjusted expectations
- **Goal difference** trends and efficiency
- **Home/away** specific performance where data available
- **Sample size weighting** for confidence adjustment

### 3) Form Analysis

Sophisticated recent form calculation:

- **Last 5 matches** with recency weighting **(1.0, 0.8, 0.6, 0.4, 0.2)**
- **Opponent strength adjustment** for context
- **Result and performance quality** (goals scored/conceded, win quality)
- **Home advantage correction** (\~5% discount/bonus)

### 4) Dynamic Weighting by Season Stage

The system adapts its reliance on different factors:

**Early Season (GW 1–5)**

- Base: **80%**, Season: **5%**, Form: **10%**, Home: **5%**

**Mid Season (GW 6–15)**

- Base: **60–80%**, Season: **5–25%**, Form: **15%**, Home: **5%**

**Late Season (GW 16+)**

- Base: **50%**, Season: **35%**, Form: **10%**, Home: **5%**

### 5) Confidence Intervals

Every rating includes uncertainty bounds based on:

- **Sample size** (more games = higher confidence)
- **Season stage** (early season = higher uncertainty)
- **Adjustment magnitude** (larger adjustments = lower confidence)

---

## 📊 Data Quality & Accuracy

### Accuracy by Season Stage

- **Early Season (GW 1–5)**: limited data, \~70% accuracy vs FPL baseline
- **Mid Season (GW 6–15)**: improving sample sizes, \~80% accuracy
- **Late Season (GW 16+)**: high confidence, \~85%+ accuracy

---

## 🛠 Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Components, ISR, hosted on Vercel)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Chart.js](https://www.chartjs.org/) for visualizations
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

---

## 📂 Project Structure

```text
src/
  app/
    strengths/                # strengths view
    team/[slug]/              # team detail pages
      components/             # team-specific UI
    page.tsx                  # home (grid + chart switcher)
  components/
    charts/                   # Chart.js helpers and wrappers
    ui/                       # shadcn/ui components + custom wrappers
  hooks/                      # state + URL sync
  lib/
    fdr/                      # core FDR algorithms (confidence, weights, form, etc.)
    fpl/                      # FPL API integration + utilities
  tests/                      # test setup + utils
  types/                      # shared TypeScript types
```

---

## 🔌 Data & Caching

- **Source**: [Official FPL API](https://fantasy.premierleague.com/api/)
- **Wrapper**: `fetchFPLData(endpoint, { revalidate: 900 })`
    - Uses **stale-while-revalidate** (\~15 minutes).
    - `?fresh=1` disables caching for debugging.

- **Computed results** (fixture matrices, attractiveness) cached with stable keys:

    ```
    fdr:v1:{season}:{view}:{gwStart}:{gwCount}
    ```

---

## ✅ Quality & Performance

- **Performance budgets**:
    - Page load < 1.5s
    - Filter changes < 100ms

- **Accessibility**: keyboard navigation, ARIA labels, colorblind-friendly scales.
- **Testing**:
    - Unit: Vitest
    - Components: React Testing Library
    - Coverage target: 85%+

- **CI**: ESLint, Prettier, Vitest on push/PR.
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Development

```bash
pnpm install
pnpm dev
```

Runs on `http://localhost:3000`.

---

## 📌 Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed phases and tasks.
