import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimelineEvent, TimelineGroup, TimelineProps } from './types';
import './Timeline.css';

function defaultGroupBy(event: TimelineEvent): string {
  return event.date;
}

function defaultGroupLabel(key: string): string {
  const date = new Date(key + 'T12:00:00');
  if (Number.isNaN(date.getTime())) return key;
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildGroups<T extends TimelineEvent>(
  events: T[],
  groupBy: (event: T) => string,
  formatGroupLabel: (key: string, groupEvents: T[]) => string,
): TimelineGroup<T>[] {
  const map = new Map<string, T[]>();

  for (const event of events) {
    const key = groupBy(event);
    const list = map.get(key) ?? [];
    list.push(event);
    map.set(key, list);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, groupEvents]) => ({
      key,
      label: formatGroupLabel(key, groupEvents),
      events: groupEvents.sort((a, b) => a.title.localeCompare(b.title)),
    }));
}

export function Timeline<T extends TimelineEvent>({
  events,
  groupBy = defaultGroupBy,
  formatGroupLabel = (key) => defaultGroupLabel(key),
  renderEvent,
  emptyMessage = 'No events to display.',
  className = '',
}: TimelineProps<T>) {
  const groups = useMemo(
    () => buildGroups(events, groupBy, formatGroupLabel),
    [events, groupBy, formatGroupLabel],
  );

  const flatItems = useMemo(() => {
    const items: Array<{ type: 'group'; groupIndex: number } | { type: 'event'; groupIndex: number; eventIndex: number }> = [];
    groups.forEach((group, groupIndex) => {
      items.push({ type: 'group', groupIndex });
      group.events.forEach((_, eventIndex) => {
        items.push({ type: 'event', groupIndex, eventIndex });
      });
    });
    return items;
  }, [groups]);

  const [focusIndex, setFocusIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const moveFocus = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (flatItems.length === 0) return;

      let next = focusIndex;

      if (direction === 'left' || direction === 'right') {
        const current = flatItems[focusIndex];
        if (current?.type !== 'event') {
          next = flatItems.findIndex((item) => item.type === 'event');
        } else {
          const groupEvents = flatItems
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item.type === 'event' && item.groupIndex === current.groupIndex);

          const pos = groupEvents.findIndex(({ index }) => index === focusIndex);
          if (direction === 'left' && pos > 0) next = groupEvents[pos - 1].index;
          if (direction === 'right' && pos < groupEvents.length - 1) next = groupEvents[pos + 1].index;
        }
      }

      if (direction === 'up' || direction === 'down') {
        const step = direction === 'up' ? -1 : 1;
        let candidate = focusIndex + step;
        while (candidate >= 0 && candidate < flatItems.length) {
          if (flatItems[candidate].type === 'event') {
            next = candidate;
            break;
          }
          candidate += step;
        }
        if (candidate < 0 || candidate >= flatItems.length) {
          const groupOnly = direction === 'up' ? focusIndex - 1 : focusIndex + 1;
          if (groupOnly >= 0 && groupOnly < flatItems.length && flatItems[groupOnly].type === 'group') {
            next = groupOnly;
          }
        }
      }

      if (next !== focusIndex) {
        setFocusIndex(next);
        const item = flatItems[next];
        if (item.type === 'group') {
          setAnnouncement(`Group: ${groups[item.groupIndex].label}, ${groups[item.groupIndex].events.length} events`);
        } else {
          const event = groups[item.groupIndex].events[item.eventIndex];
          setAnnouncement(`Event: ${event.title}, ${groups[item.groupIndex].label}`);
        }
      }
    },
    [flatItems, focusIndex, groups],
  );

  useEffect(() => {
    itemRefs.current[focusIndex]?.focus();
  }, [focusIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus('right');
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus('down');
        break;
      default:
        break;
    }
  };

  if (groups.length === 0) {
    return (
      <div className={`timeline timeline--empty ${className}`.trim()} role="status">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  let flatIndex = 0;

  return (
    <div
      className={`timeline ${className}`.trim()}
      role="application"
      aria-label="Event timeline"
      onKeyDown={handleKeyDown}
    >
      <div className="timeline__sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <p className="timeline__hint">
        Use arrow keys to navigate: Left/Right between events in a day, Up/Down between days and events.
      </p>

      <ol className="timeline__groups" aria-label="Timeline groups">
        {groups.map((group) => {
          const groupFlatIndex = flatIndex++;
          const isGroupFocused = focusIndex === groupFlatIndex;

          return (
            <li key={group.key} className="timeline__group">
              <h3
                ref={(el) => {
                  itemRefs.current[groupFlatIndex] = el;
                }}
                className={`timeline__group-label${isGroupFocused ? ' timeline__group-label--focused' : ''}`}
                tabIndex={isGroupFocused ? 0 : -1}
                onFocus={() => setFocusIndex(groupFlatIndex)}
              >
                <time dateTime={group.key}>{group.label}</time>
                <span className="timeline__group-count">{group.events.length}</span>
              </h3>

              <ol className="timeline__events" aria-label={`Events on ${group.label}`}>
                {group.events.map((event) => {
                  const eventFlatIndex = flatIndex++;
                  const isEventFocused = focusIndex === eventFlatIndex;

                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        ref={(el) => {
                          itemRefs.current[eventFlatIndex] = el;
                        }}
                        className={`timeline__event${isEventFocused ? ' timeline__event--focused' : ''}`}
                        tabIndex={isEventFocused ? 0 : -1}
                        onFocus={() => setFocusIndex(eventFlatIndex)}
                      >
                        {renderEvent ? renderEvent(event) : <span className="timeline__event-title">{event.title}</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
