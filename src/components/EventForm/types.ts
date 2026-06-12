export interface EventFormFieldOption {
  value: string;
  label: string;
}

export interface EventFormValues {
  title: string;
  date: string;
  category: string;
  status: string;
  description: string;
  location: string;
}

export const DEFAULT_CATEGORY_OPTIONS: EventFormFieldOption[] = [
  { value: 'Access', label: 'Access' },
  { value: 'Video', label: 'Video' },
  { value: 'Intrusion', label: 'Intrusion' },
  { value: 'Patrol', label: 'Patrol' },
];

export const DEFAULT_STATUS_OPTIONS: EventFormFieldOption[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'resolved', label: 'Resolved' },
];

export const EMPTY_FORM_VALUES: EventFormValues = {
  title: '',
  date: '',
  category: DEFAULT_CATEGORY_OPTIONS[0].value,
  status: DEFAULT_STATUS_OPTIONS[0].value,
  description: '',
  location: '',
};

export interface EventFormProps {
  mode?: 'add' | 'edit';
  initialValues?: Partial<EventFormValues>;
  categoryOptions?: EventFormFieldOption[];
  statusOptions?: EventFormFieldOption[];
  onSave: (values: EventFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  addTitle?: string;
  editTitle?: string;
  successMessage?: string;
  showHeader?: boolean;
  className?: string;
}

export interface EventFormDialogProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialValues?: Partial<EventFormValues>;
  onSave: (values: EventFormValues) => void;
  onClose: () => void;
  categoryOptions?: EventFormFieldOption[];
  statusOptions?: EventFormFieldOption[];
  addTitle?: string;
  editTitle?: string;
  submitLabel?: string;
  cancelLabel?: string;
  successMessage?: string;
}
