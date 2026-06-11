# Genetec React Technical Assessment

A small component library with three reusable React components, showcased in a Security Operations Console demo app.

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build   # production build
npm run preview # preview production build
```

## Components

### DataGrid

Generic, client-side data table with:

- Pagination, sorting, and per-column text filtering
- Loading, empty, and error states
- Column configuration: label, accessor (key or function), hide/show toggle panel
- Custom cell rendering via `render` prop

### Timeline

Keyboard-navigable event timeline with:

- **Grouping by day** — operational security events are naturally scheduled and reviewed per calendar day; this matches how teams plan shifts and audits.
- Arrow key navigation: Left/Right within a day, Up/Down across days and events
- Screen-reader announcements via `aria-live` when focus moves between groups and items

### EventForm

Controlled add/edit form with:

- Required title and valid date validation
- Inline error messages and focus on first invalid field on submit
- Cancel / save actions
- Success message region (`role="status"`, `aria-live="polite"`)

## Demo app

Single-page app featuring:

- **DataGrid** fed by 250 mock events (toggle buttons demo loading / error / empty states)
- **Timeline** rendering the same events, grouped by day
- **New Event** button opening a modal form; saved events appear in both grid and timeline

## Technical choices

| Area | Choice | Rationale |
|------|--------|-----------|
| Tooling | Vite + React 19 + TypeScript | Fast dev experience, strong typing for reusable APIs |
| State | React `useState` in the app | Straightforward for a demo-sized dataset; no extra dependencies |
| Styling | Plain CSS with design tokens | Keeps components portable without tying them to a UI framework |
| Modal | Native `<dialog>` | Built-in focus trap and backdrop, accessible by default |
| Data | Generated mock events | 250 rows spanning ±2 months around today |

## Project structure

```
src/
  components/
    DataGrid/
    Timeline/
    EventForm/
    Modal/
  data/mockEvents.ts
  types/event.ts
  App.tsx
```

## Author

Anna Komarova — technical assessment submission for Genetec.
