import { Modal } from '../Modal/Modal';
import { EventForm } from './EventForm';
import type { EventFormDialogProps } from './types';

export function EventFormDialog({
  isOpen,
  mode,
  formKey = 0,
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
      {isOpen ? (
        <EventForm
          key={formKey}
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
      ) : null}
    </Modal>
  );
}
