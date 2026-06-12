import { getCatalogEntry, SUPPORTING_COMPONENTS } from '../../content/componentCatalog';
import type { AppView } from '../../navigation';
import './ModuleOverview.css';

interface ModuleOverviewProps {
  moduleId: Exclude<AppView, 'home'>;
}

export function ModuleOverview({ moduleId }: ModuleOverviewProps) {
  const entry = getCatalogEntry(moduleId);
  const related = SUPPORTING_COMPONENTS.filter((component) =>
    entry.relatedComponents?.includes(component.name),
  );

  return (
    <section className="module-overview" aria-labelledby={`module-overview-${moduleId}`}>
      <p className="module-overview__eyebrow">Component overview</p>
      <div className="module-overview__header">
        <h2 id={`module-overview-${moduleId}`}>{entry.name}</h2>
        <code className="module-overview__path">{entry.importPath}</code>
      </div>
      <p className="module-overview__summary">{entry.summary}</p>
      {entry.moduleNote && <p className="module-overview__note">{entry.moduleNote}</p>}
      <ul className="module-overview__capabilities">
        {entry.capabilities.map((capability) => (
          <li key={capability}>{capability}</li>
        ))}
      </ul>
      <p className="module-overview__hint">
        <strong>Demo:</strong> {entry.demoHint}
      </p>
      {related.length > 0 && (
        <div className="module-overview__related">
          <h3>Related components</h3>
          <ul>
            {related.map((component) => (
              <li key={component.name}>
                <strong>{component.name}</strong>
                <code>{component.path}</code>
                <span>{component.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
