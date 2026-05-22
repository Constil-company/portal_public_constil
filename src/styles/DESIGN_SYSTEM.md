# CONSTIL Design System

Binance-inspired structure with **CONSTIL primary** `#448AFF` (unchanged).

## Usage

### CSS classes
- `btn-primary`, `btn-primary-pill`, `btn-secondary-on-dark`, `btn-secondary-on-light`
- `ds-canvas-dark`, `ds-canvas-light`, `ds-surface-card-dark`, `ds-surface-card-light`
- `stat-card-dark`, `chart-card-dark`, `sidebar-nav-item`, `text-input-on-light`
- `text-link`, `price-up`, `price-down`

### Tailwind tokens
- `bg-canvas-dark`, `bg-surface-card-dark`, `text-primary`, `border-hairline-on-dark`, etc.

### TypeScript
```ts
import { colors, spacing, typography } from './styles/design-system';
```

## Theme modes
- **Light** (default app shell): fundo branco / `gray-50`, navbar e sidebar brancos, cards brancos
- **Dark** (opcional, marketing): tokens `canvas-dark` + `surface-card-dark` — usar só onde fizer sentido

## Primary
- `#448AFF` — CTAs, links, chart accent, active nav
- `#3d7ef7` — pressed/active
- White text on primary buttons (`on-primary`)
