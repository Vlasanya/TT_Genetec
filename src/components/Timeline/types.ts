import type { ReactNode } from 'react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  [key: string]: unknown;
}

export interface TimelineGroup<T extends TimelineEvent> {
  key: string;
  label: string;
  events: T[];
}

export interface TimelineProps<T extends TimelineEvent> {
  events: T[];
  groupBy?: (event: T) => string;
  formatGroupLabel?: (groupKey: string, events: T[]) => string;
  renderEvent?: (event: T) => ReactNode;
  emptyMessage?: string;
  className?: string;
}
