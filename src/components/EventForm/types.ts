import type { EventFormValues } from '../../types/event';

export interface EventFormProps {
  initialValues?: Partial<EventFormValues>;
  onSave: (values: EventFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  className?: string;
}

export const EMPTY_FORM_VALUES: EventFormValues = {
  title: '',
  date: '',
  category: 'Security',
  status: 'scheduled',
  description: '',
  location: '',
};
