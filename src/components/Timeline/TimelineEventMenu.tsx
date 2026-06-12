import { useEffect, useId, useRef, type RefObject } from 'react';

interface TimelineEventMenuProps {
  eventTitle: string;
  open: boolean;
  isFocused: boolean;
  onOpenChange: (open: boolean) => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  registerTrigger: (element: HTMLButtonElement | null) => void;
  onTriggerFocus: () => void;
}

export function TimelineEventMenu({
  eventTitle,
  open,
  isFocused,
  onOpenChange,
  onViewDetails,
  onEdit,
  onDelete,
  registerTrigger,
  onTriggerFocus,
}: TimelineEventMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const viewDetailsRef = useRef<HTMLButtonElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  const close = () => onOpenChange(false);

  const menuItemRefs = [onViewDetails && viewDetailsRef, onEdit && editRef, onDelete && deleteRef].filter(
    Boolean,
  ) as RefObject<HTMLButtonElement | null>[];

  useEffect(() => {
    if (!open) return;
    menuItemRefs[0]?.current?.focus();
  }, [open, onViewDetails, onEdit, onDelete]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenChange(true);
    }
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const refs = menuItemRefs.map((ref) => ref.current).filter(Boolean) as HTMLButtonElement[];
    const activeIndex = refs.findIndex((element) => element === document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        refs[(activeIndex + 1) % refs.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        refs[(activeIndex - 1 + refs.length) % refs.length]?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const setTriggerRef = (element: HTMLButtonElement | null) => {
    registerTrigger(element);
  };

  return (
    <div className="timeline__menu" ref={rootRef}>
      <button
        type="button"
        ref={setTriggerRef}
        className={`timeline__menu-trigger${isFocused ? ' timeline__menu-trigger--focused' : ''}`}
        aria-label={`Actions for ${eventTitle}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? menuId : undefined}
        tabIndex={isFocused ? 0 : -1}
        onFocus={onTriggerFocus}
        onClick={(event) => {
          event.stopPropagation();
          onOpenChange(!open);
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <ul
          id={menuId}
          className="timeline__menu-list"
          role="menu"
          onKeyDown={handleMenuKeyDown}
        >
          {onViewDetails && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                ref={viewDetailsRef}
                className="timeline__menu-item"
                onClick={() => {
                  onViewDetails();
                  close();
                }}
              >
                View details
              </button>
            </li>
          )}
          {onEdit && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                ref={editRef}
                className="timeline__menu-item"
                onClick={() => {
                  onEdit();
                  close();
                }}
              >
                Edit
              </button>
            </li>
          )}
          {onDelete && (
            <li role="none">
              <button
                type="button"
                role="menuitem"
                ref={deleteRef}
                className="timeline__menu-item timeline__menu-item--danger"
                onClick={() => {
                  onDelete();
                  close();
                }}
              >
                Delete
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
