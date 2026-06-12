# Genetec React Technical Assessment

**Alarm & Work Order Console** — a reusable component library showcased in an operator-facing security operations workspace.

**Live demo:** [tt-genetec.vercel.app](https://tt-genetec.vercel.app/)  
**Repository:** [github.com/Vlasanya/TT_Genetec](https://github.com/Vlasanya/TT_Genetec)

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm test          # Vitest watch mode
npm run test:run  # single CI-style test run
npm run lint
```

## Navigation

The app uses hash-based routing — module URLs work on static hosts without a server:

| Module | URL hash |
|--------|----------|
| Home | `/` |
| DataGrid (Alarms & Work Orders) | `#alarms` |
| EventForm showcase | `#event-form` |
| Timeline | `#timeline` |

Each module page opens with a **Component overview** panel (capabilities, import path, demo hints) followed by the **Interactive demo**.

## Demo flows

1. **Home** — pick a module card (DataGrid, EventForm, or Timeline).
2. **Grid** (`#alarms`) — click a row to open the detail drawer; use state demo controls (`normal` / `loading` / `skeleton` / `error` / `empty`).
3. **Timeline** (`#timeline`) — arrow-key navigation between days and events; ⋯ menu → View details / Edit / Delete.
4. **EventForm** (`#event-form`) — switch inline and modal showcase variants (saves here are **demo-only**).
5. **+ New Work Order** (header on Grid and Timeline) — creates a real record in the shared store via `EventFormDialog`.
6. **Edit / Delete** — from the drawer or timeline action menu.

## Product context

The demo models Genetec's alarm and work-order domain:

- **Statuses:** `scheduled` → `acknowledged` → `resolved`
- **Categories:** Access, Video, Intrusion, Patrol
- **Views:** grid for triage, timeline for shift handover, detail drawer for investigation

## Event-driven state

Alarm lifecycle changes flow through `eventsReducer` (`EVENT_CREATED`, `EVENT_UPDATED`, `EVENT_DELETED`) inside `EventsProvider`. The DataGrid, Timeline, and Drawer all read from the same store, so a single domain event keeps every operator view in sync — similar to how alarm platforms propagate state to dashboards, timelines, and detail panes without duplicated data.

## Components

### DataGrid

Generic client-side table with pagination, sorting, column filtering, loading / skeleton / empty / error states, column visibility panel, row click handler, and **Clear filters** when no rows match.

### Timeline

Keyboard-navigable timeline grouped by day (`groupBy` is configurable). **Left / Right** moves between an event and its ⋯ action menu; **Up / Down** moves between days and events. Screen-reader announcements (`aria-live`) plus a visible focus bar. View details, Edit, and Delete from the action menu — event click focuses only (drawer opens via View details).

### EventForm

Controlled add/edit form with validation, focus on first invalid field, cancel/save actions, and success feedback (`aria-live`). Ships with `EventFormDialog` and `useEventFormDialog` for modal create/edit flows in the app shell.

### Drawer

Animated side panel with backdrop blur for work-order investigation (description, location, status, edit action).

### Supporting UI

`StatusBadge`, `ThemeToggle` (light / dark / system), `ModuleOverview` (per-module component catalog), `EventDetailPanel`.

## CI

[GitHub Actions](.github/workflows/ci.yml) runs on every push and pull request to `main`:

- `npm ci`
- `npm run test:run`
- `npm run build`

## Deployment

### Vercel (live demo)

The public demo is hosted on [Vercel](https://tt-genetec.vercel.app/). Connect the GitHub repository in the Vercel dashboard; the default Vite build settings work out of the box (`npm run build`, output `dist/`, base path `/`).

### GitHub Pages (optional)

A [Deploy workflow](.github/workflows/deploy.yml) is included for `https://<username>.github.io/TT_Genetec/`. Before the first deploy:

1. Open **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions**
3. Push to `main` or re-run the Deploy workflow

The workflow sets `VITE_BASE_PATH=/<repo-name>/` for correct asset paths on GitHub Pages.

## Technical choices

| Area | Choice | Rationale |
|------|--------|-----------|
| Tooling | Vite + React 19 + TypeScript | Fast iteration with strong component APIs |
| State | `useReducer` + `EventsProvider` | Event-driven updates across grid, timeline, and drawer |
| Styling | CSS custom properties | Portable components without a UI framework lock-in |
| Routing | Hash URLs | Works on static hosts (Vercel, GitHub Pages) without SPA rewrites |
| Modal / Drawer | Native `<dialog>` + accessible markup | Focus handling without heavy dependencies |
| Testing | Vitest + React Testing Library | Component and integration coverage |
| Deployment | Vercel (+ optional GitHub Pages) | Public demo URL for assessment submission |

## Project structure

```text
src/
  components/
    DataGrid/
    Timeline/
    EventForm/          # EventForm, EventFormDialog, EventFormShowcase
    Drawer/
    EventDetail/
    StatusBadge/
    ThemeToggle/
    ModuleOverview/
  store/
    eventsReducer.ts
    EventsProvider.tsx
  content/componentCatalog.ts
  pages/HomePage.tsx
  config/eventFormOptions.ts
  hooks/useTheme.ts
  theme/initTheme.ts
  navigation.ts
  data/mockEvents.ts
  types/event.ts
  utils/event.ts
  App.tsx
.github/workflows/
  ci.yml
  deploy.yml
```

## Tests

Vitest + React Testing Library cover components, the events reducer, navigation, catalog data, and app flows for create, edit, delete, and detail drawer access (52 tests).

## Author

Anna Komarova — technical assessment submission for Genetec.
