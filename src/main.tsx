import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { INITIAL_EVENTS } from './data/mockEvents';
import { EventsProvider } from './store';
import { applyTheme, readThemePreference } from './theme/initTheme';
import './index.css';

applyTheme(readThemePreference());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EventsProvider initialEvents={INITIAL_EVENTS}>
      <App />
    </EventsProvider>
  </StrictMode>,
);
