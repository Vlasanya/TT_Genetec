import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Timeline } from './Timeline';
import type { TimelineEvent } from './types';

const events: TimelineEvent[] = [
  { id: '1', date: '2026-06-10', title: 'Morning patrol' },
  { id: '2', date: '2026-06-10', title: 'Badge review' },
  { id: '3', date: '2026-06-11', title: 'Camera audit' },
];

describe('Timeline', () => {
  it('groups events by day', () => {
    render(<Timeline events={events} />);

    expect(screen.getByText('Morning patrol')).toBeInTheDocument();
    expect(screen.getByText('Badge review')).toBeInTheDocument();
    expect(screen.getByText('Camera audit')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('shows empty state when there are no events', () => {
    render(<Timeline events={[]} emptyMessage="No timeline events" />);
    expect(screen.getByText('No timeline events')).toBeInTheDocument();
  });

  it('focuses events on click without opening actions', async () => {
    const user = userEvent.setup();
    const onEventActivate = vi.fn();
    const onEventEdit = vi.fn();
    render(
      <Timeline events={events} onEventActivate={onEventActivate} onEventEdit={onEventEdit} />,
    );

    await user.click(screen.getByRole('button', { name: 'Badge review' }));

    expect(screen.getByRole('button', { name: 'Badge review' })).toHaveFocus();
    expect(onEventActivate).not.toHaveBeenCalled();
    expect(onEventEdit).not.toHaveBeenCalled();
  });

  it('moves focus to the action menu with arrow right', async () => {
    const user = userEvent.setup();
    render(<Timeline events={events} onEventEdit={vi.fn()} onEventDelete={vi.fn()} />);

    const liveRegion = document.querySelector('[aria-live="polite"]');

    await user.click(screen.getByRole('button', { name: 'Badge review' }));
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('button', { name: 'Actions for Badge review' })).toHaveFocus();
    expect(liveRegion).toHaveTextContent(/Actions for Badge review/);
  });

  it('shows a visible focus bar that mirrors screen reader announcements', async () => {
    const user = userEvent.setup();
    render(<Timeline events={events} onEventEdit={vi.fn()} onEventDelete={vi.fn()} />);

    expect(screen.getByText('Focused:')).toBeInTheDocument();
    expect(screen.getByText(/Group · Jun 10/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Camera audit' }));

    expect(screen.getByText('Camera audit · Jun 11')).toBeInTheDocument();
  });

  it('announces focus changes for screen readers on arrow keys', async () => {
    const user = userEvent.setup();
    render(<Timeline events={events} onEventEdit={vi.fn()} onEventDelete={vi.fn()} />);

    const liveRegion = document.querySelector('[aria-live="polite"]');

    await user.click(screen.getByRole('button', { name: 'Badge review' }));
    await user.keyboard('{ArrowRight}{ArrowLeft}');

    expect(liveRegion).toHaveTextContent(/Event: Badge review/);
  });

  it('moves between days with arrow down', async () => {
    const user = userEvent.setup();
    render(<Timeline events={events} onEventEdit={vi.fn()} />);

    const liveRegion = document.querySelector('[aria-live="polite"]');

    await user.click(screen.getByRole('button', { name: 'Morning patrol' }));
    await user.keyboard('{ArrowDown}');

    expect(liveRegion).toHaveTextContent(/Event: Camera audit/);
  });

  it('opens the menu with Enter and selects an action with keyboard', async () => {
    const user = userEvent.setup();
    const onEventEdit = vi.fn();
    const onEventDelete = vi.fn();
    render(<Timeline events={events} onEventEdit={onEventEdit} onEventDelete={onEventDelete} />);

    await user.click(screen.getByRole('button', { name: 'Badge review' }));
    await user.keyboard('{ArrowRight}{Enter}');

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(onEventDelete).toHaveBeenCalledWith(events[1]);
  });

  it('calls view details, edit, and delete handlers from the actions menu', async () => {
    const user = userEvent.setup();
    const onEventActivate = vi.fn();
    const onEventEdit = vi.fn();
    const onEventDelete = vi.fn();
    render(
      <Timeline
        events={events}
        onEventActivate={onEventActivate}
        onEventEdit={onEventEdit}
        onEventDelete={onEventDelete}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Actions for Badge review' }));
    await user.click(screen.getByRole('menuitem', { name: 'View details' }));
    expect(onEventActivate).toHaveBeenCalledWith(events[1]);

    await user.click(screen.getByRole('button', { name: 'Actions for Badge review' }));
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onEventEdit).toHaveBeenCalledWith(events[1]);

    await user.click(screen.getByRole('button', { name: 'Actions for Badge review' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onEventDelete).toHaveBeenCalledWith(events[1]);
  });
});
