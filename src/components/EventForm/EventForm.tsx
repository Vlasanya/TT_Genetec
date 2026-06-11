import { useId, useRef, useState } from 'react';
import type { EventFormValues } from '../../types/event';
import type { EventFormProps } from './types';
import { EMPTY_FORM_VALUES } from './types';
import { getFirstErrorField, validateEventForm } from './validation';
import './EventForm.css';

const CATEGORIES = ['Security', 'Access Control', 'Maintenance', 'Training', 'Audit'];

export function EventForm({
  initialValues,
  onSave,
  onCancel,
  submitLabel = 'Save event',
  className = '',
}: EventFormProps) {
  const formId = useId();
  const [values, setValues] = useState<EventFormValues>({
    ...EMPTY_FORM_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormValues, string>>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fieldRefs = useRef<Partial<Record<keyof EventFormValues, HTMLElement | null>>>({});

  const updateField = <K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      const nextValues = { ...values, [field]: value };
      setErrors(validateEventForm(nextValues));
    }
    setSuccessMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validateEventForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstField = getFirstErrorField(validationErrors);
      if (firstField) {
        fieldRefs.current[firstField]?.focus();
      }
      return;
    }

    onSave({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
    });
    setSuccessMessage('Event saved successfully.');
  };

  const fieldErrorId = (field: keyof EventFormValues) => `${formId}-${field}-error`;

  return (
    <form
      className={`event-form ${className}`.trim()}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={`${formId}-title`}
    >
      <h2 id={`${formId}-title`} className="event-form__title">
        {initialValues?.title ? 'Edit event' : 'Add event'}
      </h2>

      <div
        className="event-form__success"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {successMessage}
      </div>

      <div className="event-form__field">
        <label htmlFor={`${formId}-title-input`}>Title *</label>
        <input
          id={`${formId}-title-input`}
          ref={(el) => {
            fieldRefs.current.title = el;
          }}
          type="text"
          value={values.title}
          onChange={(e) => updateField('title', e.target.value)}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? fieldErrorId('title') : undefined}
          autoComplete="off"
        />
        {errors.title && (
          <span id={fieldErrorId('title')} className="event-form__error" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div className="event-form__field">
        <label htmlFor={`${formId}-date-input`}>Date *</label>
        <input
          id={`${formId}-date-input`}
          ref={(el) => {
            fieldRefs.current.date = el;
          }}
          type="date"
          value={values.date}
          onChange={(e) => updateField('date', e.target.value)}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? fieldErrorId('date') : undefined}
        />
        {errors.date && (
          <span id={fieldErrorId('date')} className="event-form__error" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <div className="event-form__row">
        <div className="event-form__field">
          <label htmlFor={`${formId}-category-input`}>Category</label>
          <select
            id={`${formId}-category-input`}
            value={values.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="event-form__field">
          <label htmlFor={`${formId}-status-input`}>Status</label>
          <select
            id={`${formId}-status-input`}
            value={values.status}
            onChange={(e) => updateField('status', e.target.value as EventFormValues['status'])}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="event-form__field">
        <label htmlFor={`${formId}-location-input`}>Location</label>
        <input
          id={`${formId}-location-input`}
          type="text"
          value={values.location}
          onChange={(e) => updateField('location', e.target.value)}
        />
      </div>

      <div className="event-form__field">
        <label htmlFor={`${formId}-description-input`}>Description</label>
        <textarea
          id={`${formId}-description-input`}
          rows={3}
          value={values.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>

      <div className="event-form__actions">
        <button type="button" className="event-form__btn event-form__btn--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="event-form__btn event-form__btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
