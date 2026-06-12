import { COMPONENT_CATALOG } from '../content/componentCatalog';
import type { AppView } from '../navigation';
import './HomePage.css';

interface HomePageProps {
  eventCount: number;
  onNavigate: (view: Exclude<AppView, 'home'>) => void;
}

export function HomePage({ eventCount, onNavigate }: HomePageProps) {
  return (
    <div className="home">
      <header className="home__intro">
        <h2 className="home__title">Component library</h2>
        <p className="home__subtitle">
          Three reusable React components for alarm and work-order operations. Open a module to read its
          overview and try the interactive demo.
        </p>
      </header>

      <div className="home__grid">
        {COMPONENT_CATALOG.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={`home__card home__card--${entry.id}`}
            onClick={() => onNavigate(entry.id)}
          >
            <span className="home__card-label">Open demo</span>
            <h3 className="home__card-title">{entry.demoTitle}</h3>
            <p className="home__card-package">{entry.name}</p>
            <p className="home__card-desc">{entry.summary}</p>
            {entry.moduleNote && <p className="home__card-note">{entry.moduleNote}</p>}
            <ul className="home__card-features">
              {entry.capabilities.slice(0, 3).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {entry.id === 'grid' && (
              <span className="home__card-meta">{eventCount} live records in demo store</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
