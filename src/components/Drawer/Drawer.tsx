import { useEffect, useId, useRef, useState } from 'react';
import './Drawer.css';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PANEL_TRANSITION_MS = 420;

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return;
    }
    setIsActive(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isRendered || !isOpen) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsActive(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isRendered, isOpen]);

  useEffect(() => {
    if (!isActive) return;

    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onClose]);

  useEffect(() => {
    if (!isRendered || isOpen) return;

    const timeout = window.setTimeout(() => setIsRendered(false), PANEL_TRANSITION_MS + 80);
    return () => clearTimeout(timeout);
  }, [isRendered, isOpen]);

  const handlePanelTransitionEnd = (event: React.TransitionEvent<HTMLElement>) => {
    if (event.target !== panelRef.current || event.propertyName !== 'transform') return;
    if (!isOpen) {
      setIsRendered(false);
    }
  };

  if (!isOpen && !isRendered) return null;

  return (
    <div
      className={`drawer${isActive ? ' drawer--active' : ''}`}
      aria-hidden={!isOpen && !isActive}
    >
      <button type="button" className="drawer__backdrop" aria-label="Close details" onClick={onClose} />
      <aside
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        <header className="drawer__header">
          <h2 id={titleId} className="drawer__title">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </header>
        <div className="drawer__body">{children}</div>
      </aside>
    </div>
  );
}
