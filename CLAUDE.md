# Testek Build Tracker — Project Context

## What This Is

A demo SPA built for Testek Inc., an aerospace/industrial test stand manufacturer. The app simulates a real-time build tracker for complex test stand assembly — each machine takes 50–100 sequential steps across phases like Mechanical Assembly, Electrical Integration, FAT, etc.

This is a **sales demo prototype**, not a production system. It must look and behave like a real product.

---

## Client Background (Testek Inc.)

- **Contact**: Ed Falkowski — Director of Operations (E. Falkowski in the app NavBar)
- **Industry**: Aerospace / hydraulic / electrical test stand manufacturing
- **Business model**: Engineer-to-order (~60–70% reusability across builds)
- **Key challenge**: Tribal knowledge loss — senior technicians retiring without documenting techniques
- **Infrastructure constraint**: Strictly on-premise, no cloud, CMMC 2.0 compliance required
- **ERP**: Epicor (on-prem)
- **Current state**: Active PDM/PLM rollout (SOLIDWORKS Vault + custom PLM), Epicor integration in progress

### Meeting context (May 2025)

- Ed oversees what he calls "Testek 3.0" — a full operational modernization
- Engineers currently handle their own BOM, design, production scheduling, and execution
- Machines have 3–4 computers each, fully customized per customer spec
- 2 shifts (~16 hours), downtime planning is manual
- The terminology in this demo (FAT, phase gates, step IDs, torque specs) was specifically noted as relevant and accurate by Ed
- He wants something that feels like a **product**, not a custom consulting engagement
- Any demo must be tailored, manufacturing-specific, and non-generic

---

## Demo Scenario

Three programs currently in-flight:

| ID | Name | Status |
|----|------|--------|
| TSK-2024-047 | Hydraulic Load Frame | Phase 2, On Track |
| TSK-2024-051 | Servo-Hydraulic Fatigue Stand | Phase 3, Blocked |
| TSK-2024-058 | Multi-Axis Force Platform | Phase 4, Awaiting Sign-Off |

Active technician is on TSK-2024-051 (the blocked stand) — demonstrates the blocker/escalation workflow.

---

## Tech Stack

- **Framework**: React 18 + Vite 5 (SPA, no backend, no SSR)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui v4 (`radix-nova` style)
- **State**: `useReducer` in `App.jsx`, no external state library
- **Fonts**: IBM Plex Sans + IBM Plex Mono
- **Icons**: `lucide-react`
- **Path alias**: `@/` → `./src` (via `jsconfig.json`)
- **Tests**: `@playwright/test` + `@axe-core/playwright` (3 passing, zero WCAG 2.1 AA violations)

### Key files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root state, reducer, view routing |
| `src/data/initialState.js` | All mock data — projects, phases, steps |
| `src/styles/tokens.js` | Brand color/font tokens (source of truth for inline styles) |
| `src/styles/global.css` | Tailwind imports, keyframes, reduced-motion media query |
| `src/components/NavBar.jsx` | Top nav, live clock, user badge (E. Falkowski) |
| `src/components/ManagerView.jsx` | Dashboard: AI insights + project cards grid |
| `src/components/TechnicianView.jsx` | Sidebar + phase spine + step list + handoff |
| `src/components/AIInsightsPanel.jsx` | Mock AI fleet analysis with animated refresh |
| `src/components/ShiftHandoff.jsx` | Phase-aware shift notes with AI suggestions |
| `src/components/PhaseSpine.jsx` | Phase progress dots — keyboard-accessible |
| `src/components/StepCard.jsx` | Individual step — complete/flag/resolve actions |
| `src/components/BlockedItemsPanel.jsx` | Manager view blocked items summary |

---

## Design System

shadcn/ui is the adopted design system. Rules:
- Use shadcn registry components and semantic tokens (`bg-primary`, `text-muted-foreground`) for new work
- No hardcoded hex colors for new components — use `tokens.js` values or CSS custom properties
- `cn()` from `@/lib/utils` for conditional class merging
- `@theme inline` block in global.css maps brand tokens to Tailwind utilities (`bg-testek-navy`, `bg-testek-red`, etc.)

### Brand tokens (`src/styles/tokens.js`)

```js
navy: '#0B1F3A'     // primary background, headers
red: '#C8102E'      // Testek brand red, active indicators
textMuted: '#505F6E' // muted text — min 4.5:1 contrast on white
green: '#1A7F4B'    // success / on-track
amber: '#B85C00'    // warning / awaiting sign-off
```

Accessible text-on-color overrides (WCAG AA verified):
- Amber text on light bg: `#7A3D00`
- Green text on light bg: `#177040`
- Any text on dark navy bg: `rgba(255,255,255,0.65)` minimum

---

## Accessibility

All WCAG 2.1 AA requirements met (verified via playwright + axe-core):
- Keyboard nav: all interactive elements reachable and activatable
- Color contrast: all text passes 4.5:1 minimum
- ARIA: landmark regions, `aria-label`, `aria-current`, `aria-live` in place
- `prefers-reduced-motion` media query in global.css suppresses all animations
- Focus indicators: visible via `:focus-visible` across all interactive elements

---

## Mock AI Features

The app has no real AI — all "AI" is simulated with `setTimeout` and pre-crafted domain responses:

- **AI Fleet Insights** (`AIInsightsPanel`): Analyzes projects array → generates contextual risk signals, sign-off urgency, block escalation notices. Refresh cycles through 5 confidence phrases.
- **AI Shift Handoff** (`ShiftHandoff`): Phase-aware suggestions per `phaseGuidance` map — keys must match exact `PHASE_DEFS` names.
- **AI Suggest Resolution** (in `StepCard` when blocked): Loads after ~1.4s, shows aerospace-domain resolution suggestions.

When adding new mock AI features, keep responses domain-specific (torque specs, hydraulic pressures, FAT protocols) — generic AI responses will stand out negatively in a demo context.

---

## Demo Narrative

The story to tell:
1. **Manager View** — Fleet-level AI insights surface a blocked stand and approaching FAT deadline
2. **Click a project card** → switches to Technician View for that project
3. **Technician View** — Shows the blocked step, allows resolving or flagging, shift handoff with phase-aware AI suggestions
4. **AI refresh** — Each click shows different confidence labels, simulating live analysis

Key talking point: The 50–100 step build process, phase gates, and FAT milestone are real Testek workflows reflected accurately in the demo data.

---

## Development Notes

- Run dev server: `npm run dev` → `http://localhost:5173`
- Run a11y tests: `npx playwright test tests/a11y.spec.js --reporter=list`
- All dates use `2026-*` base (current year for demo) — do not revert to 2024
- `activeTechnicianProject` in `initialState.js` should be `'TSK-2024-051'` (the blocked project) for demo impact
