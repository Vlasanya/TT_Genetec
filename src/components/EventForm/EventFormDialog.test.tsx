import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventFormDialog } from './EventFormDialog';

describe('EventFormDialog', () => {
  it('renders add mode with modal title and form fields', () => {
    render(
      <EventFormDialog
        isOpen
        mode="add"
        onSave={vi.fn()}
        onClose={vi.fn()}
        addTitle="New Work Order"
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'New Work Order' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Add event' })).not.toBeInTheDocument();
  });

  it('submits valid values through the dialog', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <EventFormDialog
        isOpen
        mode="add"
        onSave={onSave}
        onClose={vi.fn()}
        submitLabel="Save work order"
      />,
    );

    await user.type(screen.getByLabelText('Title *'), 'Library event');
    await user.type(screen.getByLabelText('Date *'), '2026-06-20');
    await user.click(screen.getByRole('button', { name: 'Save work order' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Library event',
        date: '2026-06-20',
      }),
    );
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<EventFormDialog isOpen mode="add" onSave={vi.fn()} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
