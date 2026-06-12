import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EventForm } from './EventForm';

describe('EventForm', () => {
  it('shows validation errors and focuses the title field on invalid submit', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<EventForm onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save event' }));

    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows date validation error when title is filled but date is missing', async () => {
    const user = userEvent.setup();

    render(<EventForm onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Title *'), 'Valid title');
    await user.click(screen.getByRole('button', { name: 'Save event' }));

    expect(screen.getByText('Date is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Date *')).toHaveFocus();
  });

  it('calls onSave and shows success message for valid input', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<EventForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText('Title *'), 'New patrol');
    await user.type(screen.getByLabelText('Date *'), '2026-06-15');
    await user.click(screen.getByRole('button', { name: 'Save event' }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New patrol',
        date: '2026-06-15',
      }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('Event saved successfully.');
  });

  it('calls onCancel when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<EventForm onSave={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('renders edit mode when initial title is provided', () => {
    render(
      <EventForm
        initialValues={{ title: 'Existing event' }}
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Edit event' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toHaveValue('Existing event');
  });
});
