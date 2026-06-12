import type { Event } from '../../types/event';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import './EventDetailPanel.css';

interface EventDetailPanelProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export function EventDetailPanel({ event, onEdit }: EventDetailPanelProps) {
  return (
    <div className="event-detail">
      <div className="event-detail__header">
        <h3 className="event-detail__title">{event.title}</h3>
        <StatusBadge status={event.status} />
      </div>

      <dl className="event-detail__meta">
        <div>
          <dt>Date</dt>
          <dd>
            <time dateTime={event.date}>{event.date}</time>
          </dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{event.category}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{event.location || '—'}</dd>
        </div>
      </dl>

      <section className="event-detail__section" aria-labelledby="event-detail-description">
        <h4 id="event-detail-description">Description</h4>
        <p>{event.description || 'No description provided.'}</p>
      </section>

      <button type="button" className="event-detail__edit" onClick={() => onEdit(event)}>
        Edit work order
      </button>
    </div>
  );
}
