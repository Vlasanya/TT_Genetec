import { Modal } from '../Modal/Modal';
import { EventForm } from './EventForm';
import type { EventFormDialogProps } from './types';

export function EventFormDialog({
  isOpen,
  mode,
  initialValues,
  onSave,
  onClose,
  categoryOptions,
  statusOptions,
  addTitle = 'Add event',
  editTitle = 'Edit event',
  submitLabel = 'Save event',
  cancelLabel = 'Cancel',
  successMessage = 'Event saved successfully.',
}: EventFormDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? editTitle : addTitle}>
      <EventForm
        key={`${mode}-${initialValues?.title ?? 'new'}-${initialValues?.date ?? ''}`}
        mode={mode}
        initialValues={initialValues}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        onSave={onSave}
        onCancel={onClose}
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        successMessage={successMessage}
        showHeader={false}
      />
    </Modal>
  );
}
