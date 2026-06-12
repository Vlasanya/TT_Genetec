import type { EventFormValues } from './types';

export type FormErrors = Partial<Record<keyof EventFormValues, string>>;

export function validateEventForm(values: EventFormValues): FormErrors {
  const errors: FormErrors = {};

  const title = values.title.trim();
  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (!values.date) {
    errors.date = 'Date is required.';
  } else {
    const parsed = new Date(values.date + 'T12:00:00');
    if (Number.isNaN(parsed.getTime())) {
      errors.date = 'Please enter a valid date.';
    }
  }

  return errors;
}

export function getFirstErrorField(errors: FormErrors): keyof EventFormValues | null {
  const order: (keyof EventFormValues)[] = ['title', 'date', 'category', 'status', 'location', 'description'];
  return order.find((field) => errors[field]) ?? null;
}
