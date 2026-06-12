import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataGrid, type DataGridColumn } from './components/DataGrid';
import { Drawer } from './components/Drawer/Drawer';
import { EventDetailPanel } from './components/EventDetail/EventDetailPanel';
import { EventFormDialog, EventFormShowcase, useEventFormDialog } from './components/EventForm';
import { StatusBadge } from './components/StatusBadge/StatusBadge';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { Timeline } from './components/Timeline';
import { APP_EVENT_FORM_CATEGORIES, APP_EVENT_FORM_STATUSES } from './config/eventFormOptions';
import { useTheme } from './hooks/useTheme';
import { hashFromView, viewFromHash, type AppView } from './navigation';
import { ModuleOverview } from './components/ModuleOverview/ModuleOverview';
import { HomePage } from './pages/HomePage';
import { useEventsStore } from './store';
import type { Event } from './types/event';
import { toFormValues } from './utils/event';
import './App.css';

type GridViewState = 'normal' | 'loading' | 'skeleton' | 'error' | 'empty';

const VIEW_TITLES: Record<AppView, string> = {
  home: 'Alarm & Work Order Console',
  grid: 'Alarms & Work Orders',
  form: 'EventForm',
  timeline: 'Operator Timeline',
};

function App() {
  const { resolved: theme, toggleTheme } = useTheme();
  const { events, createEvent, updateEvent, deleteEvent } = useEventsStore();
  const eventForm = useEventFormDialog();
  const [view, setView] = useState<AppView>(() => viewFromHash(window.location.hash));
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [gridView, setGridView] = useState<GridViewState>('normal');

  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;

  const navigate = useCallback((next: AppView) => {
    const hash = hashFromView(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setView(next);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setView(viewFromHash(window.location.hash));
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const columns = useMemo<DataGridColumn<Event>[]>(
    () => [
      { id: 'id', label: 'ID', accessor: 'id', hidden: true },
      { id: 'title', label: 'Title', accessor: 'title' },
      { id: 'date', label: 'Date', accessor: 'date' },
      { id: 'category', label: 'Category', accessor: 'category' },
      {
        id: 'status',
        label: 'Status',
        accessor: 'status',
        render: (value) => <StatusBadge status={value as Event['status']} />,
      },
      { id: 'location', label: 'Location', accessor: 'location' },
    ],
    [],
  );

  const gridData = gridView === 'empty' ? [] : events;
  const gridLoading = gridView === 'loading';
  const gridSkeleton = gridView === 'skeleton';
  const gridError = gridView === 'error' ? 'Failed to load alarms and work orders.' : null;

  const openCreateForm = () => {
    setEditingEvent(null);
    eventForm.openAdd();
  };

  const openEditForm = (event: Event) => {
    setEditingEvent(event);
    eventForm.openEdit(toFormValues(event));
  };

  const closeForm = () => {
    eventForm.close();
    setEditingEvent(null);
  };

  const openEventDetail = (event: Event) => {
    setSelectedEventId(event.id);
  };

  const closeEventDetail = () => {
    setSelectedEventId(null);
  };

  const handleDeleteEvent = (event: Event) => {
    deleteEvent(event.id);
    if (selectedEventId === event.id) {
      closeEventDetail();
    }
  };

  const handleSaveEvent = (values: Parameters<typeof createEvent>[0]) => {
    if (editingEvent) {
      const updated = updateEvent(editingEvent, values);
      setSelectedEventId(updated.id);
    } else {
      const created = createEvent(values);
      setSelectedEventId(created.id);
    }
    closeForm();
  };

  const showNewWorkOrder = view === 'grid' || view === 'timeline';

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            G
          </span>
          <div>
            <h1>{VIEW_TITLES[view]}</h1>
            <p>
              {view === 'home'
                ? 'Operator workspace for alarms, patrols, and work order triage'
                : 'Genetec component library — live demo module'}
            </p>
          </div>
        </div>
        <div className="app__header-actions">
          <ThemeToggle resolved={theme} onToggle={toggleTheme} />
          {showNewWorkOrder && (
            <button type="button" className="app__new-btn" onClick={openCreateForm}>
              + New Work Order
            </button>
          )}
        </div>
      </header>

      <div className="app__body">
        <main className="app__main">
          {view !== 'home' && (
            <nav className="app__main-nav" aria-label="Module navigation">
              <button type="button" className="app__back-btn" onClick={() => navigate('home')}>
                ← Home
              </button>
            </nav>
          )}

          {view === 'home' && <HomePage eventCount={events.length} onNavigate={navigate} />}

          {view === 'grid' && (
            <section className="app__section" aria-labelledby="grid-heading">
              <ModuleOverview moduleId="grid" />
              <div className="app__demo-divider" aria-hidden="true" />
              <div className="app__section-header">
                <div>
                  <p className="app__demo-label">Interactive demo</p>
                  <h2 id="grid-heading">Alarms &amp; Work Orders</h2>
                </div>
                <div className="app__demo-controls" role="group" aria-label="DataGrid state demo">
                  {(['normal', 'loading', 'skeleton', 'error', 'empty'] as GridViewState[]).map((state) => (
                    <button
                      key={state}
                      type="button"
                      className={gridView === state ? 'active' : ''}
                      onClick={() => setGridView(state)}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
              <DataGrid
                data={gridData}
                columns={columns}
                rowKey="id"
                loading={gridLoading}
                skeleton={gridSkeleton}
                error={gridError}
                emptyMessage="No alarms or work orders match your filters."
                pageSize={10}
                onRowClick={openEventDetail}
              />
            </section>
          )}

          {view === 'form' && (
            <section className="app__section">
              <ModuleOverview moduleId="form" />
              <div className="app__demo-divider" aria-hidden="true" />
              <p className="app__demo-label">Interactive demo</p>
              <EventFormShowcase />
            </section>
          )}

          {view === 'timeline' && (
            <section className="app__section" aria-labelledby="timeline-heading">
              <ModuleOverview moduleId="timeline" />
              <div className="app__demo-divider" aria-hidden="true" />
              <p className="app__demo-label">Interactive demo</p>
              <h2 id="timeline-heading">Operator Timeline</h2>
              <Timeline
                events={events}
                selectedEventId={selectedEventId}
                onEventActivate={openEventDetail}
                onEventEdit={openEditForm}
                onEventDelete={handleDeleteEvent}
                renderEvent={(event) => (
                  <div className="timeline-card">
                    <span className="timeline-card__title">{event.title}</span>
                    <span className="timeline-card__meta">
                      {event.category} · <StatusBadge status={event.status} /> · {event.location}
                    </span>
                  </div>
                )}
              />
            </section>
          )}
        </main>

        <Drawer
          isOpen={Boolean(selectedEvent)}
          onClose={closeEventDetail}
          title="Work order details"
        >
          {selectedEvent && <EventDetailPanel event={selectedEvent} onEdit={openEditForm} />}
        </Drawer>
      </div>

      <EventFormDialog
        isOpen={eventForm.isOpen}
        mode={eventForm.mode}
        initialValues={eventForm.initialValues}
        onSave={handleSaveEvent}
        onClose={closeForm}
        categoryOptions={APP_EVENT_FORM_CATEGORIES}
        statusOptions={APP_EVENT_FORM_STATUSES}
        addTitle="New Work Order"
        editTitle="Edit Work Order"
        submitLabel="Save work order"
        successMessage="Work order saved successfully."
      />
    </div>
  );
}

export default App;
