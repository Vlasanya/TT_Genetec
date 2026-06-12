import { STATUS_LABELS, type EventStatus } from '../../types/event';
import './StatusBadge.css';

interface StatusBadgeProps {
  status: EventStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>{STATUS_LABELS[status]}</span>
  );
}
