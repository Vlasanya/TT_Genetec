import type { AppView } from '../navigation';

export interface ComponentCatalogEntry {
  id: Exclude<AppView, 'home'>;
  name: string;
  demoTitle: string;
  importPath: string;
  summary: string;
  capabilities: string[];
  demoHint: string;
  moduleNote?: string;
  relatedComponents?: string[];
}

export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  {
    id: 'grid',
    name: 'DataGrid',
    demoTitle: 'Alarms & Work Orders',
    importPath: 'components/DataGrid',
    summary:
      'Generic client-side table for alarm and work-order triage. Configurable columns with accessor, label, sort, filter, and custom render.',
    capabilities: [
      'Client-side pagination, sorting, and column filtering',
      'Loading, skeleton, empty, and error states',
      'Column hide / show panel',
      'Row click handler for investigation flows',
      'Clear filters when no rows match',
    ],
    demoHint: 'Click a row to open the detail drawer. Use demo controls to preview grid states.',
    relatedComponents: ['Drawer'],
  },
  {
    id: 'form',
    name: 'EventForm',
    demoTitle: 'EventForm',
    importPath: 'components/EventForm',
    summary:
      'Controlled add/edit form with validation, accessible error feedback, and cancel/save flow. Ships with EventFormDialog and useEventFormDialog for modal workflows.',
    capabilities: [
      'Required title and valid date validation',
      'Validation messages and focus on first invalid field',
      'Success message region (aria-live)',
      'Configurable category/status option lists',
      'Inline and modal variants via EventFormDialog',
    ],
    demoHint: 'Switch between inline add, inline edit, and modal variants in the interactive demo.',
    moduleNote:
      'Reusable add/edit form — try each variant in the demo. Saves in the EventForm showcase are demo-only and do not change live data in the grid or timeline.',
    relatedComponents: ['EventFormDialog'],
  },
  {
    id: 'timeline',
    name: 'Timeline',
    demoTitle: 'Operator Timeline',
    importPath: 'components/Timeline',
    summary:
      'Keyboard-navigable timeline grouped by day for shift handover. Events expose an action menu for view, edit, and delete.',
    capabilities: [
      'Groups events by day (configurable groupBy)',
      'Arrow Left/Right between event and ⋯ menu',
      'Arrow Up/Down between days and events',
      'Screen-reader announcements and visible focus bar',
      'View details, Edit, Delete from action menu',
    ],
    demoHint: 'Use arrow keys to move focus. Open ⋯ → View details to investigate a work order.',
    relatedComponents: ['Drawer'],
  },
];

export function getCatalogEntry(id: Exclude<AppView, 'home'>): ComponentCatalogEntry {
  const entry = COMPONENT_CATALOG.find((item) => item.id === id);
  if (!entry) {
    throw new Error(`Unknown catalog entry: ${id}`);
  }
  return entry;
}

export const SUPPORTING_COMPONENTS = [
  {
    name: 'Drawer',
    path: 'components/Drawer',
    summary: 'Animated side panel for work-order investigation.',
  },
  {
    name: 'EventFormDialog',
    path: 'components/EventForm',
    summary: 'Modal wrapper around EventForm for create/edit flows.',
  },
];
