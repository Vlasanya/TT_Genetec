export type AppView = 'home' | 'grid' | 'form' | 'timeline';

const VIEW_HASHES: Record<Exclude<AppView, 'home'>, string> = {
  grid: 'alarms',
  form: 'event-form',
  timeline: 'timeline',
};

export function viewFromHash(hash: string): AppView {
  const path = hash.replace(/^#/, '');
  if (path === VIEW_HASHES.grid) return 'grid';
  if (path === VIEW_HASHES.form) return 'form';
  if (path === VIEW_HASHES.timeline) return 'timeline';
  return 'home';
}

export function hashFromView(view: AppView): string {
  if (view === 'home') return '';
  return `#${VIEW_HASHES[view]}`;
}
