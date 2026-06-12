import { useState } from 'react';
import { EventForm } from './EventForm';
import { EventFormDialog } from './EventFormDialog';
import { useEventFormDialog } from './useEventFormDialog';
import {
  DEFAULT_CATEGORY_OPTIONS,
  DEFAULT_STATUS_OPTIONS,
  type EventFormValues,
} from './types';
import './EventFormShowcase.css';

type ShowcaseVariant = 'inline-add' | 'inline-edit' | 'dialog-add' | 'dialog-edit';

const SHOWCASE_VARIANTS: { id: ShowcaseVariant; label: string; description: string }[] = [
  {
    id: 'inline-add',
    label: 'Inline add',
    description: 'Standalone form with header, validation, focus management, and success region.',
  },
  {
    id: 'inline-edit',
    label: 'Inline edit',
    description: 'Pre-filled controlled form in edit mode — same component, different initial values.',
  },
  {
    id: 'dialog-add',
    label: 'Modal add',
    description: 'EventFormDialog wraps the form in an accessible native dialog for create flows.',
  },
  {
    id: 'dialog-edit',
    label: 'Modal edit',
    description: 'Dialog edit mode with domain-specific labels and option lists passed via props.',
  },
];

const SAMPLE_EDIT_VALUES: EventFormValues = {
  title: 'Perimeter camera offline',
  date: '2026-06-10',
  category: 'Video',
  status: 'acknowledged',
  description: 'Camera 12 lost signal during the night patrol route.',
  location: 'North gate',
};

export function EventFormShowcase() {
  const [variant, setVariant] = useState<ShowcaseVariant>('inline-add');
  const [inlineKey, setInlineKey] = useState(0);
  const dialog = useEventFormDialog();
  const active = SHOWCASE_VARIANTS.find((item) => item.id === variant)!;

  const resetInlineDemo = () => setInlineKey((key) => key + 1);

  const handleDemoSave = () => {
    resetInlineDemo();
  };

  return (
    <section className="event-form-showcase" aria-labelledby="event-form-showcase-heading">
      <div className="event-form-showcase__header">
        <h2 id="event-form-showcase-heading">EventForm showcase</h2>
        <div className="event-form-showcase__controls" role="tablist" aria-label="EventForm variants">
          {SHOWCASE_VARIANTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={variant === item.id}
              className={variant === item.id ? 'active' : ''}
              onClick={() => setVariant(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="event-form-showcase__variant-desc">{active.description}</p>

      <div className="event-form-showcase__panel" role="tabpanel" aria-label={active.label}>
        {variant === 'inline-add' && (
          <EventForm
            key={`add-${inlineKey}`}
            mode="add"
            categoryOptions={DEFAULT_CATEGORY_OPTIONS}
            statusOptions={DEFAULT_STATUS_OPTIONS}
            onSave={handleDemoSave}
            onCancel={resetInlineDemo}
            submitLabel="Save event"
            successMessage="Demo saved — validation and success region shown."
          />
        )}

        {variant === 'inline-edit' && (
          <EventForm
            key={`edit-${inlineKey}`}
            mode="edit"
            initialValues={SAMPLE_EDIT_VALUES}
            categoryOptions={DEFAULT_CATEGORY_OPTIONS}
            statusOptions={DEFAULT_STATUS_OPTIONS}
            onSave={handleDemoSave}
            onCancel={resetInlineDemo}
            submitLabel="Save changes"
            editTitle="Edit event"
            successMessage="Demo updated — form stays controlled after submit."
          />
        )}

        {variant === 'dialog-add' && (
          <div className="event-form-showcase__dialog-demo">
            <p>Opens EventFormDialog — the same pattern used by the header action in this app.</p>
            <button type="button" className="event-form-showcase__open-btn" onClick={dialog.openAdd}>
              Open add dialog
            </button>
          </div>
        )}

        {variant === 'dialog-edit' && (
          <div className="event-form-showcase__dialog-demo">
            <p>Pre-filled edit dialog with configurable titles and field options.</p>
            <button
              type="button"
              className="event-form-showcase__open-btn"
              onClick={() => dialog.openEdit(SAMPLE_EDIT_VALUES)}
            >
              Open edit dialog
            </button>
          </div>
        )}
      </div>

      <EventFormDialog
        isOpen={dialog.isOpen}
        mode={dialog.mode}
        initialValues={dialog.initialValues}
        onSave={() => dialog.close()}
        onClose={dialog.close}
        categoryOptions={DEFAULT_CATEGORY_OPTIONS}
        statusOptions={DEFAULT_STATUS_OPTIONS}
        addTitle="Add event (dialog)"
        editTitle="Edit event (dialog)"
        submitLabel="Save event"
        successMessage="Dialog demo saved successfully."
      />
    </section>
  );
}
