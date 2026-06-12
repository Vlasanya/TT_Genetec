import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataGrid } from './DataGrid';
import type { DataGridColumn } from './types';

interface Row extends Record<string, unknown> {
  id: string;
  name: string;
  category: string;
}

const columns: DataGridColumn<Row>[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'category', label: 'Category', accessor: 'category' },
  { id: 'hidden', label: 'Hidden', accessor: 'id', hidden: true },
];

const data: Row[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  name: `Event ${String(i + 1).padStart(2, '0')}`,
  category: i % 2 === 0 ? 'Security' : 'Audit',
}));

function renderGrid(overrides: Partial<Parameters<typeof DataGrid<Row>>[0]> = {}) {
  return render(
    <DataGrid
      data={data}
      columns={columns}
      rowKey="id"
      pageSize={10}
      {...overrides}
    />,
  );
}

describe('DataGrid', () => {
  it('renders rows with pagination', () => {
    renderGrid();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Event 01')).toBeInTheDocument();
    expect(screen.getByText('Event 10')).toBeInTheDocument();
    expect(screen.queryByText('Event 11')).not.toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  it('navigates to the next page', async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(screen.getByText('Event 11')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('sorts rows when a column header is clicked', async () => {
    const user = userEvent.setup();
    renderGrid({ data: [
      { id: '1', name: 'Charlie', category: 'A' },
      { id: '2', name: 'Alice', category: 'B' },
      { id: '3', name: 'Bob', category: 'C' },
    ] });

    const sortBtn = screen.getByRole('button', { name: 'Sort by Name' });
    await user.click(sortBtn);

    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(within(rows[0]).getByText('Alice')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Charlie')).toBeInTheDocument();
  });

  it('filters rows by column value', async () => {
    const user = userEvent.setup();
    renderGrid();

    await user.type(screen.getByRole('searchbox', { name: 'Filter by Category' }), 'Audit');

    expect(screen.getByText('7 records')).toBeInTheDocument();
    expect(screen.getByText('Event 02')).toBeInTheDocument();
    expect(screen.queryByText('Event 01')).not.toBeInTheDocument();
  });

  it('ignores leading spaces in filter input', async () => {
    const user = userEvent.setup();
    renderGrid();

    const nameFilter = screen.getByRole('searchbox', { name: 'Filter by Name' });
    await user.type(nameFilter, '   ');

    expect(nameFilter).toHaveValue('');
    expect(screen.getByText('15 records')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();

    await user.type(nameFilter, 'Event 01');

    expect(nameFilter).toHaveValue('Event 01');
    expect(screen.getByText('1 record')).toBeInTheDocument();
    expect(screen.getByText('Event 01')).toBeInTheDocument();
  });

  it('keeps filters visible when nothing matches and allows clearing them', async () => {
    const user = userEvent.setup();
    renderGrid();

    const nameFilter = screen.getByRole('searchbox', { name: 'Filter by Name' });
    await user.type(nameFilter, 'no-match-value');

    expect(screen.getByText('0 records')).toBeInTheDocument();
    expect(screen.getByText(/No records match your filters/i)).toBeInTheDocument();
    expect(nameFilter).toHaveValue('no-match-value');
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));

    expect(screen.getByText('15 records')).toBeInTheDocument();
    expect(screen.getByText('Event 01')).toBeInTheDocument();
    expect(nameFilter).toHaveValue('');
  });

  it('shows loading state', () => {
    renderGrid({ loading: true });
    expect(screen.getByText('Loading data…')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('shows skeleton placeholder rows', () => {
    renderGrid({ skeleton: true, skeletonRows: 5 });
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(document.querySelectorAll('.data-grid__skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByRole('navigation', { name: 'Table pagination' })).not.toBeInTheDocument();
  });

  it('shows error state', () => {
    renderGrid({ error: 'Something went wrong' });
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('shows empty state', () => {
    renderGrid({ data: [], emptyMessage: 'Nothing here' });
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderGrid({ onRowClick, data: [data[0]] });

    await user.click(screen.getByRole('row', { name: /Event 01/ }));

    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('toggles column visibility', async () => {
    const user = userEvent.setup();
    const onColumnVisibilityChange = vi.fn();
    renderGrid({ onColumnVisibilityChange });

    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    const hiddenToggle = screen.getByRole('checkbox', { name: 'Hidden' });
    await user.click(hiddenToggle);

    expect(screen.getByRole('button', { name: 'Sort by Hidden' })).toBeInTheDocument();
    expect(onColumnVisibilityChange).toHaveBeenCalledWith('hidden', true);
  });
});
