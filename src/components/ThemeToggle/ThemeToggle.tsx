import './ThemeToggle.css';

interface ThemeToggleProps {
  resolved: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ resolved, onToggle }: ThemeToggleProps) {
  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className={`theme-toggle__thumb${isDark ? ' theme-toggle__thumb--dark' : ''}`} />
        <span className="theme-toggle__icon theme-toggle__icon--sun">☀</span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">☾</span>
      </span>
      <span className="theme-toggle__label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
