import { useMemo, useState } from 'react';
import { DataGrid, type DataGridColumn } from './components/DataGrid';
import { EventForm } from './components/EventForm';
import { Modal } from './components/Modal/Modal';
import { Timeline } from './components/Timeline';
import { INITIAL_EVENTS } from './data/mockEvents';
import type { Event, EventFormValues } from './types/event';
import './App.css';

type GridViewState = 'normal' | 'loading' | 'error' | 'empty';

const STATUS_LABELS: Record<Event['status'], string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function StatusBadge({ status }: { status: Event['status'] }) {
  return <span className={`status-badge status-badge--${status}`}>{STATUS_LABELS[status]}</span>;
}

function createEventId(): string {
  return `evt-${Date.now()}`;
}

export default function App() {
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [gridView, setGridView] = useState<GridViewState>('normal');

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
  const gridError = gridView === 'error' ? 'Failed to load events. Please try again later.' : null;

  const handleSaveEvent = (values: EventFormValues) => {
    const newEvent: Event = {
      id: createEventId(),
      title: values.title,
      date: values.date,
      category: values.category,
      status: values.status,
      description: values.description,
      location: values.location,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsFormOpen(false);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true">
            G
          </span>
          <div>
            <h1>Security Operations Console</h1>
            <p>Event monitoring demo — reusable component library</p>
          </div>
        </div>
        <button type="button" className="app__new-btn" onClick={() => setIsFormOpen(true)}>
          + New Event
        </button>
      </header>

      <main className="app__main">
        <section className="app__section" aria-labelledby="grid-heading">
          <div className="app__section-header">
            <h2 id="grid-heading">Events DataGrid</h2>
            <div className="app__demo-controls" role="group" aria-label="DataGrid state demo">
              {(['normal', 'loading', 'error', 'empty'] as GridViewState[]).map((state) => (
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
            error={gridError}
            emptyMessage="No events match your filters."
            pageSize={10}
          />
        </section>

        <section className="app__section" aria-labelledby="timeline-heading">
          <h2 id="timeline-heading">Events Timeline</h2>
          <p className="app__section-desc">
            Grouped by day — the natural unit for operational events in a security context.
          </p>
          <Timeline
            events={events}
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
      </main>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Event">
        <EventForm onSave={handleSaveEvent} onCancel={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
