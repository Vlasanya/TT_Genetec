# Genetec React Technical Assessment

**Alarm & Work Order Console** — a reusable component library showcased in an operator-facing security operations workspace.

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
npm test
npm run test:run
```

## Live demo

After pushing to GitHub:

1. Open **Settings → Pages → Build and deployment**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the [Deploy workflow](.github/workflows/deploy.yml) publishes the app

Live URL:

```text
https://<your-github-username>.github.io/<repository-name>/
```

## Product context

The demo models Genetec's alarm and work-order domain:

- **Statuses:** `scheduled` → `acknowledged` → `resolved`
- **Categories:** Access, Video, Intrusion, Patrol
- **Views:** grid for triage, timeline for shift handover, detail drawer for investigation

## Event-driven state

Alarm lifecycle changes flow through a small `eventsReducer` (`EVENT_CREATED`, `EVENT_UPDATED`, `EVENT_DELETED`). Both the DataGrid and Timeline subscribe to the same store, so a single domain event keeps every operator view in sync. This mirrors how alarm platforms propagate state changes to dashboards, timelines, and detail panes without each view owning its own copy of the data.

## Components

### DataGrid

Generic client-side table with pagination, sorting, filtering, loading/skeleton/empty/error states, column visibility, and row selection.

### Timeline

Keyboard-navigable timeline grouped by day. Left/Right moves between an event and its action menu; Up/Down moves between days and events. Screen-reader announcements and a visible focus bar. View details, Edit, and Delete are available from the ⋯ action menu.

### EventForm

Controlled add/edit form with validation, focus management, cancel/save actions, and `EventFormDialog` for modal workflows. The home page includes an interactive showcase (inline and modal variants).

### Drawer

Animated side panel for work order investigation with description, location, and status.

## Demo flows

- Start on the **home page** (module cards) and open DataGrid, EventForm, or Timeline — each module page includes a component overview panel
- **Grid:** click a row to open the detail drawer; use demo controls for loading/empty/error states
- **Timeline:** arrow-key navigation; ⋯ → View details / Edit / Delete
- **EventForm:** switch showcase variants; header **+ New Work Order** creates a real record in the shared store
- Edit from the drawer or timeline action menu

## CI

[GitHub Actions](.github/workflows/ci.yml) runs on every push and pull request to `main`:

- `npm ci`
- `npm run test:run`
- `npm run build`

## Technical choices

| Area | Choice | Rationale |
|------|--------|-----------|
| Tooling | Vite + React 19 + TypeScript | Fast iteration with strong component APIs |
| State | `useReducer` events store | Event-driven updates across grid, timeline, and drawer |
| Styling | CSS custom properties | Portable components without a UI framework lock-in |
| Modal / Drawer | Native patterns + accessible markup | Focus handling without heavy dependencies |
| Deployment | GitHub Pages | Zero-cost public demo linked from the submission email |

## Project structure

```text
src/
  components/
    DataGrid/
    Timeline/
    EventForm/
    Drawer/
    EventDetail/
    StatusBadge/
    ModuleOverview/
  store/
  content/componentCatalog.ts
  pages/HomePage.tsx
  data/mockEvents.ts
  types/event.ts
  utils/event.ts
  App.tsx
.github/workflows/
  ci.yml
  deploy.yml
```

## Tests

Vitest + React Testing Library cover components, the events reducer, and app flows for create, edit, delete, and detail drawer access.

## Author

Anna Komarova — technical assessment submission for Genetec.
