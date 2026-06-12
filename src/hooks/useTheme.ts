import { useCallback, useEffect, useState } from 'react';
import { applyTheme, readThemePreference, resolveTheme, type ThemePreference } from '../theme/initTheme';

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference);
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolveTheme(readThemePreference()));

  useEffect(() => {
    setResolved(applyTheme(preference));
    localStorage.setItem('theme', preference);

    if (preference !== 'system' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setResolved(applyTheme('system'));

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  const toggleTheme = useCallback(() => {
    setPreference((current) => (resolveTheme(current) === 'dark' ? 'light' : 'dark'));
  }, []);

  const setThemePreference = useCallback((next: ThemePreference) => {
    setPreference(next);
  }, []);

  return { preference, resolved, toggleTheme, setThemePreference };
}
