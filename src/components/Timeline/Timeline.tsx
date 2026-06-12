import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TimelineEvent, TimelineGroup, TimelineProps } from './types';
import { TimelineEventMenu } from './TimelineEventMenu';
import './Timeline.css';

type FlatItem =
  | { type: 'group'; groupIndex: number }
  | { type: 'event'; groupIndex: number; eventIndex: number }
  | { type: 'menu'; groupIndex: number; eventIndex: number };

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

function isNavigableItem(item: FlatItem): item is Exclude<FlatItem, { type: 'group' }> {
  return item.type === 'event' || item.type === 'menu';
}

function findVerticalTarget(flatItems: FlatItem[], fromIndex: number, direction: 'up' | 'down'): number {
  const step = direction === 'up' ? -1 : 1;
  const current = flatItems[fromIndex];

  if (current.type === 'menu') {
    const pairedEventIndex = fromIndex - 1;
    if (direction === 'up' && flatItems[pairedEventIndex]?.type === 'event') {
      return pairedEventIndex;
    }

    let candidate = fromIndex + 1;
    while (candidate < flatItems.length) {
      if (flatItems[candidate].type === 'event') {
        return candidate;
      }
      candidate += 1;
    }

    return fromIndex;
  }

  let candidate = fromIndex + step;
  while (candidate >= 0 && candidate < flatItems.length) {
    const item = flatItems[candidate];
    if (item.type === 'event') {
      return candidate;
    }
    if (item.type === 'group' && direction === 'up') {
      return candidate;
    }
    candidate += step;
  }

  return fromIndex;
}

function formatShortDate(dateKey: string): string {
  const date = new Date(dateKey + 'T12:00:00');
  if (Number.isNaN(date.getTime())) return dateKey;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function announceItem<T extends TimelineEvent>(
  item: FlatItem,
  groups: TimelineGroup<T>[],
): string {
  if (item.type === 'group') {
    return `Group: ${groups[item.groupIndex].label}, ${groups[item.groupIndex].events.length} events`;
  }

  const event = groups[item.groupIndex].events[item.eventIndex];
  if (item.type === 'menu') {
    return `Actions for ${event.title}`;
  }

  return `Event: ${event.title}, ${groups[item.groupIndex].label}`;
}

function formatFocusLabel<T extends TimelineEvent>(
  item: FlatItem,
  groups: TimelineGroup<T>[],
): string {
  if (item.type === 'group') {
    const group = groups[item.groupIndex];
    return `Group · ${formatShortDate(group.key)} (${group.events.length})`;
  }

  const event = groups[item.groupIndex].events[item.eventIndex];
  const shortDate = formatShortDate(groups[item.groupIndex].key);

  if (item.type === 'menu') {
    return `Actions · ${event.title}`;
  }

  return `${event.title} · ${shortDate}`;
}

export function Timeline<T extends TimelineEvent>({
  events,
  groupBy = defaultGroupBy,
  formatGroupLabel = (key) => defaultGroupLabel(key),
  renderEvent,
  emptyMessage = 'No events to display.',
  selectedEventId = null,
  onEventActivate,
  onEventEdit,
  onEventDelete,
  className = '',
}: TimelineProps<T>) {
  const showEventMenu = Boolean(onEventActivate || onEventEdit || onEventDelete);
  const groups = useMemo(
    () => buildGroups(events, groupBy, formatGroupLabel),
    [events, groupBy, formatGroupLabel],
  );

  const flatItems = useMemo(() => {
    const items: FlatItem[] = [];
    groups.forEach((group, groupIndex) => {
      items.push({ type: 'group', groupIndex });
      group.events.forEach((_, eventIndex) => {
        items.push({ type: 'event', groupIndex, eventIndex });
        if (showEventMenu) {
          items.push({ type: 'menu', groupIndex, eventIndex });
        }
      });
    });
    return items;
  }, [groups, showEventMenu]);

  const [focusIndex, setFocusIndex] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  const setFocus = useCallback(
    (index: number) => {
      if (index === focusIndex) return;
      setOpenMenuId(null);
      setFocusIndex(index);
      setAnnouncement(announceItem(flatItems[index], groups));
    },
    [flatItems, focusIndex, groups],
  );

  const moveFocus = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (flatItems.length === 0 || openMenuId) return;

      let next = focusIndex;
      const current = flatItems[focusIndex];

      if (direction === 'left' || direction === 'right') {
        const step = direction === 'left' ? -1 : 1;

        if (current.type === 'group') {
          if (direction === 'right') {
            const target = flatItems.findIndex(
              (item, index) =>
                index > focusIndex &&
                item.groupIndex === current.groupIndex &&
                isNavigableItem(item),
            );
            if (target !== -1) next = target;
          }
        } else {
          let candidate = focusIndex + step;
          while (candidate >= 0 && candidate < flatItems.length) {
            const item = flatItems[candidate];
            if (isNavigableItem(item) && item.groupIndex === current.groupIndex) {
              next = candidate;
              break;
            }
            if (item.type === 'group') break;
            candidate += step;
          }
        }
      }

      if (direction === 'up' || direction === 'down') {
        next = findVerticalTarget(flatItems, focusIndex, direction);
      }

      if (next !== focusIndex) {
        setFocus(next);
      }
    },
    [flatItems, focusIndex, openMenuId, setFocus],
  );

  useEffect(() => {
    if (flatItems.length === 0) return;
    if (focusIndex >= flatItems.length) {
      const nextIndex = flatItems.length - 1;
      setFocusIndex(nextIndex);
      setAnnouncement(announceItem(flatItems[nextIndex], groups));
    }
  }, [flatItems, focusIndex, groups]);

  useEffect(() => {
    if (openMenuId) return;
    itemRefs.current[focusIndex]?.focus();
  }, [focusIndex, openMenuId]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (openMenuId) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveFocus('left');
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveFocus('right');
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
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

  const focusedItem = flatItems[focusIndex];
  const focusLabel = focusedItem ? formatFocusLabel(focusedItem, groups) : '';

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
      <div className="timeline__focus-bar" aria-hidden="true">
        <span className="timeline__focus-label">Focused:</span>
        <span className="timeline__focus-value">{focusLabel}</span>
      </div>
      <p className="timeline__hint">
        Arrow keys move between events and action menus. Press Enter on an action menu to open it,
        then use arrows to choose View details, Edit, or Delete.
      </p>

      <ol className="timeline__groups" aria-label="Timeline groups">
        {groups.map((group) => {
          const groupFlatIndex = flatIndex++;
          const isGroupFocused = focusIndex === groupFlatIndex;

          return (
            <li key={group.key} className="timeline__group">
              <h3
                ref={(element) => {
                  itemRefs.current[groupFlatIndex] = element;
                }}
                className={`timeline__group-label${isGroupFocused ? ' timeline__group-label--focused' : ''}`}
                tabIndex={isGroupFocused ? 0 : -1}
                onFocus={() => setFocus(groupFlatIndex)}
              >
                <time dateTime={group.key}>{group.label}</time>
                <span className="timeline__group-count">{group.events.length}</span>
              </h3>

              <ol className="timeline__events" aria-label={`Events on ${group.label}`}>
                {group.events.map((event) => {
                  const eventFlatIndex = flatIndex++;
                  const menuFlatIndex = showEventMenu ? flatIndex++ : null;
                  const isEventFocused = focusIndex === eventFlatIndex;
                  const isMenuFocused = menuFlatIndex !== null && focusIndex === menuFlatIndex;

                  return (
                    <li key={event.id} className="timeline__event-item">
                      <div className="timeline__event-row">
                        <button
                          type="button"
                          ref={(element) => {
                            itemRefs.current[eventFlatIndex] = element;
                          }}
                          className={[
                            'timeline__event',
                            isEventFocused ? 'timeline__event--focused' : '',
                            selectedEventId === event.id ? 'timeline__event--selected' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          tabIndex={isEventFocused ? 0 : -1}
                          onFocus={() => setFocus(eventFlatIndex)}
                        >
                          {renderEvent ? renderEvent(event) : <span className="timeline__event-title">{event.title}</span>}
                        </button>
                        {showEventMenu && menuFlatIndex !== null && (
                          <TimelineEventMenu
                            eventTitle={event.title}
                            open={openMenuId === event.id}
                            isFocused={isMenuFocused}
                            onOpenChange={(isOpen) => setOpenMenuId(isOpen ? event.id : null)}
                            onViewDetails={onEventActivate ? () => onEventActivate(event) : undefined}
                            onEdit={onEventEdit ? () => onEventEdit(event) : undefined}
                            onDelete={onEventDelete ? () => onEventDelete(event) : undefined}
                            registerTrigger={(element) => {
                              itemRefs.current[menuFlatIndex] = element;
                            }}
                            onTriggerFocus={() => setFocus(menuFlatIndex)}
                          />
                        )}
                      </div>
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
