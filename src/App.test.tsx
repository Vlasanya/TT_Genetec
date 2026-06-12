import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { EventsProvider } from './store';
import type { Event } from './types/event';

const seedEvents: Event[] = [
  {
    id: 'evt-0001',
    title: 'Seed event alpha',
    date: '2026-06-10',
    category: 'Access',
    status: 'scheduled',
    description: 'Test',
    location: 'Building A',
  },
  {
    id: 'evt-0002',
    title: 'Seed event beta',
    date: '2026-06-11',
    category: 'Video',
    status: 'acknowledged',
    description: 'Test',
    location: 'Building B',
  },
];

function renderApp() {
  window.location.hash = '';
  return render(
    <EventsProvider initialEvents={seedEvents}>
      <App />
    </EventsProvider>,
  );
}

async function openModule(
  user: ReturnType<typeof userEvent.setup>,
  name: 'Alarms & Work Orders' | 'EventForm' | 'Operator Timeline',
) {
  const homeGrid = document.querySelector('.home__grid');
  expect(homeGrid).not.toBeNull();
  await user.click(within(homeGrid as HTMLElement).getByRole('button', { name: new RegExp(name, 'i') }));
}

describe('App', () => {
  it('renders the home page with three module blocks', () => {
    renderApp();

    expect(screen.getByRole('heading', { name: 'Alarm & Work Order Console' })).toBeInTheDocument();
    const homeGrid = document.querySelector('.home__grid');
    expect(homeGrid).not.toBeNull();
    expect(within(homeGrid as HTMLElement).getByRole('button', { name: /Alarms & Work Orders/i })).toBeInTheDocument();
    expect(within(homeGrid as HTMLElement).getByRole('button', { name: /EventForm/i })).toBeInTheDocument();
    expect(within(homeGrid as HTMLElement).getByRole('button', { name: /Operator Timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Component library' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'DataGrid' })).not.toBeInTheDocument();
    expect(screen.getByText('2 live records in demo store')).toBeInTheDocument();
  });

  it('navigates to the grid module and shows seed data', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Alarms & Work Orders');

    expect(screen.getByRole('heading', { name: 'Alarms & Work Orders', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Component overview')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'DataGrid' })).toBeInTheDocument();
    expect(screen.getByText('Interactive demo')).toBeInTheDocument();
    expect(screen.getByText(/Click a row to open the detail drawer/i)).toBeInTheDocument();
    expect(screen.getAllByText('Seed event alpha').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Seed event beta').length).toBeGreaterThanOrEqual(1);
  });

  it('adds a new work order to the grid and timeline after form submit', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Alarms & Work Orders');
    await user.click(screen.getByRole('button', { name: '+ New Work Order' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('heading', { name: 'New Work Order' })).toBeInTheDocument();

    await user.type(within(dialog).getByLabelText('Title *'), 'Created from test');
    await user.type(within(dialog).getByLabelText('Date *'), '2026-06-20');
    await user.click(within(dialog).getByRole('button', { name: 'Save work order' }));

    expect(screen.getByRole('dialog', { name: 'Work order details' })).toBeInTheDocument();
    expect(screen.getAllByText('Created from test').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('3 records')).toBeInTheDocument();
  });

  it('opens the detail drawer from a grid row click', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Alarms & Work Orders');
    await user.click(screen.getByRole('row', { name: /Seed event alpha/ }));

    const drawer = screen.getByRole('dialog', { name: 'Work order details' });
    expect(within(drawer).getByRole('heading', { name: 'Seed event alpha', level: 3 })).toBeInTheDocument();
    expect(within(drawer).getByText('Building A')).toBeInTheDocument();
  });

  it('opens the detail drawer from the timeline View details action', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Operator Timeline');
    await user.click(screen.getByRole('button', { name: 'Actions for Seed event beta' }));
    await user.click(screen.getByRole('menuitem', { name: 'View details' }));

    const drawer = screen.getByRole('dialog', { name: 'Work order details' });
    expect(within(drawer).getByText('Acknowledged')).toBeInTheDocument();
  });

  it('edits a work order from the detail drawer', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Alarms & Work Orders');
    await user.click(screen.getByRole('row', { name: /Seed event alpha/ }));
    await user.click(screen.getByRole('button', { name: 'Edit work order' }));

    const dialog = screen.getAllByRole('dialog').find((element) =>
      within(element).queryByRole('heading', { name: 'Edit Work Order' }),
    );
    expect(dialog).toBeDefined();

    const titleInput = within(dialog!).getByLabelText('Title *');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated alpha');
    await user.click(within(dialog!).getByRole('button', { name: 'Save work order' }));

    expect(screen.getAllByText('Updated alpha').length).toBeGreaterThanOrEqual(1);
  });

  it('deletes an event from the timeline actions menu', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Operator Timeline');
    await user.click(screen.getByRole('button', { name: 'Actions for Seed event beta' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(screen.queryByText('Seed event beta')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '← Home' }));
    await openModule(user, 'Alarms & Work Orders');
    expect(screen.getByText('1 record')).toBeInTheDocument();
  });

  it('switches DataGrid to loading state via demo controls', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'Alarms & Work Orders');
    await user.click(screen.getByRole('button', { name: 'loading' }));

    expect(screen.getByText('Loading data…')).toBeInTheDocument();
  });

  it('returns to the home page from a module', async () => {
    const user = userEvent.setup();
    renderApp();

    await openModule(user, 'EventForm');
    expect(screen.getByRole('heading', { name: 'EventForm', level: 1 })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '← Home' }));
    expect(screen.getByRole('heading', { name: 'Alarm & Work Order Console' })).toBeInTheDocument();
  });
});
