# AI Team Dashboard

Real-time monitoring and analytics dashboard for AI team operations (Ula, 0xcat, Kawa).

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Language:** TypeScript
- **Styling:** TailwindCSS 4 + CSS Variables + Glassmorphism
- **Charts:** Recharts (dynamic import, SSR-off)
- **Icons:** Lucide React
- **Theme:** Dark / Light mode with CSS custom properties

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
ai-dashboard/
├── app/
│   ├── layout.tsx              # Root layout + ThemeProvider + skip-link
│   ├── globals.css             # CSS variables (dark/light), glass, a11y
│   ├── page.tsx                # Dashboard — KPIs, agents, charts
│   ├── agents/
│   │   ├── page.tsx            # Agent list + summary + detail table
│   │   └── [id]/page.tsx       # Agent detail — KPIs, tokens, trends, tasks
│   ├── tasks/page.tsx          # Task queue + filters
│   └── settings/page.tsx       # Display, notifications, advanced settings
├── components/
│   ├── Sidebar.tsx             # Responsive nav (mobile hamburger + collapse)
│   ├── Header.tsx              # Page header
│   ├── Grid.tsx                # Responsive grid (1/2/3/4 cols)
│   ├── KPICard.tsx             # Metric card with trend
│   ├── AgentCard.tsx           # Agent status card
│   ├── TaskRow.tsx             # Task list row with progress bar
│   ├── StatusBadge.tsx         # Status pill (7 states)
│   ├── StatusIndicator.tsx     # Dot + label status
│   ├── DashboardChart.tsx      # Line/Bar chart (Recharts)
│   ├── AreaChartCard.tsx       # Area chart with gradient fill
│   └── PieChartCard.tsx        # Donut chart
├── lib/
│   ├── mock-data.ts            # Centralized mock data layer
│   ├── hooks.ts                # Data hooks with auto-refresh
│   └── theme.tsx               # Theme context (dark/light)
└── tailwind.config.ts          # CSS variable-based color tokens
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — KPI cards, system status, agent overview, charts |
| `/agents` | Agent list with summary stats and detail table |
| `/agents/[id]` | Agent detail — tokens, performance trends, recent tasks |
| `/tasks` | Task queue with status filters |
| `/settings` | Display (dark mode), notifications, advanced config |

## Design System

### Theme

CSS custom properties drive all colors. Toggle between dark and light via Settings or `useTheme()` hook.

- **Dark:** Cyan accent (#00D9FF), deep backgrounds (#0A0A0F)
- **Light:** Sky blue accent (#0284C7), slate backgrounds (#F8FAFC)

### Glass Cards

All cards use `.glass` class — gradient background, backdrop blur, themed border glow on hover.

### Typography

- **UI:** Inter (300–700)
- **Monospace:** JetBrains Mono (numbers, code)

## Data Layer

`lib/mock-data.ts` contains all mock data. `lib/hooks.ts` wraps it in React hooks with configurable auto-refresh intervals.

To connect real APIs, replace the fetcher functions inside each hook — the component layer stays unchanged.

```typescript
// Example: swap mock with real API
export function useAgents(refreshMs = 30000) {
  return useFetch<Agent[]>(
    () => fetch('/api/agents').then(r => r.json()),
    refreshMs
  );
}
```

## Accessibility

- Skip-to-content link (`#main-content`)
- `role`, `aria-label`, `aria-current`, `aria-pressed`, `aria-checked` on interactive elements
- `role="progressbar"` with `aria-valuenow/min/max` on progress bars
- `role="switch"` on toggle controls
- `focus-visible` outlines on all interactive elements
- `prefers-reduced-motion` disables all transitions/animations
- Semantic HTML (`nav`, `main`, `section`, `table`, `thead`, `tbody`)
- Color contrast ratios designed for WCAG AA

## Performance

- Charts loaded via `next/dynamic` with `ssr: false` (code splitting)
- Loading skeletons for async chart components
- CSS transitions capped at 200–300ms
- Minimal bundle: no heavy UI library, just Tailwind + Lucide + Recharts

## License

Internal project — not for public distribution.
