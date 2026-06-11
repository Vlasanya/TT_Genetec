import { useMemo, useState } from 'react';
import type { DataGridColumn, DataGridProps, DataGridSortState } from './types';
import './DataGrid.css';

function getRowKey<T extends Record<string, unknown>>(
  row: T,
  rowKey: DataGridProps<T>['rowKey'],
): string {
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey]);
}

function getCellValue<T extends Record<string, unknown>>(
  row: T,
  column: DataGridColumn<T>,
): unknown {
  if (typeof column.accessor === 'function') return column.accessor(row);
  return row[column.accessor];
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  loading = false,
  error = null,
  emptyMessage = 'No records found.',
  onColumnVisibilityChange,
  className = '',
}: DataGridProps<T>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState<DataGridSortState | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.hidden).map((c) => c.id)),
  );
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.has(c.id)),
    [columns, hiddenColumns],
  );

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      visibleColumns.every((column) => {
        if (!column.filterable) return true;
        const filterValue = filters[column.id]?.trim().toLowerCase();
        if (!filterValue) return true;
        const cellValue = getCellValue(row, column);
        return String(cellValue ?? '').toLowerCase().includes(filterValue);
      }),
    );
  }, [data, filters, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!sort) return filteredData;
    const column = columns.find((c) => c.id === sort.columnId);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const result = compareValues(getCellValue(a, column), getCellValue(b, column));
      return sort.direction === 'asc' ? result : -result;
    });
  }, [filteredData, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageData = sortedData.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = (columnId: string) => {
    setPage(0);
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, direction: 'asc' };
      if (prev.direction === 'asc') return { columnId, direction: 'desc' };
      return null;
    });
  };

  const updateFilter = (columnId: string, value: string) => {
    setPage(0);
    setFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  const toggleColumnVisibility = (columnId: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
        onColumnVisibilityChange?.(columnId, true);
      } else {
        next.add(columnId);
        onColumnVisibilityChange?.(columnId, false);
      }
      return next;
    });
  };

  const sortIndicator = (columnId: string) => {
    if (!sort || sort.columnId !== columnId) return '↕';
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`data-grid ${className}`.trim()} role="region" aria-label="Data table">
      <div className="data-grid__toolbar">
        <span className="data-grid__count" aria-live="polite">
          {loading ? 'Loading…' : `${sortedData.length} record${sortedData.length === 1 ? '' : 's'}`}
        </span>
        <button
          type="button"
          className="data-grid__columns-btn"
          aria-expanded={showColumnPanel}
          aria-controls="column-visibility-panel"
          onClick={() => setShowColumnPanel((v) => !v)}
        >
          Columns
        </button>
      </div>

      {showColumnPanel && (
        <div id="column-visibility-panel" className="data-grid__column-panel" role="group" aria-label="Column visibility">
          {columns.map((column) => (
            <label key={column.id} className="data-grid__column-toggle">
              <input
                type="checkbox"
                checked={!hiddenColumns.has(column.id)}
                onChange={() => toggleColumnVisibility(column.id)}
              />
              {column.label}
            </label>
          ))}
        </div>
      )}

      <div className="data-grid__table-wrap">
        {loading ? (
          <div className="data-grid__state" role="status">
            <div className="data-grid__spinner" aria-hidden="true" />
            <p>Loading data…</p>
          </div>
        ) : error ? (
          <div className="data-grid__state data-grid__state--error" role="alert">
            <p>{error}</p>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="data-grid__state" role="status">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <table className="data-grid__table">
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <th key={column.id} scope="col">
                    <div className="data-grid__header-cell">
                      {column.sortable !== false ? (
                        <button
                          type="button"
                          className="data-grid__sort-btn"
                          onClick={() => toggleSort(column.id)}
                          aria-label={`Sort by ${column.label}`}
                        >
                          {column.label}
                          <span aria-hidden="true">{sortIndicator(column.id)}</span>
                        </button>
                      ) : (
                        <span>{column.label}</span>
                      )}
                    </div>
                    {column.filterable !== false && (
                      <input
                        type="search"
                        className="data-grid__filter"
                        placeholder={`Filter ${column.label.toLowerCase()}`}
                        value={filters[column.id] ?? ''}
                        onChange={(e) => updateFilter(column.id, e.target.value)}
                        aria-label={`Filter by ${column.label}`}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((row) => (
                <tr key={getRowKey(row, rowKey)}>
                  {visibleColumns.map((column) => {
                    const value = getCellValue(row, column);
                    return (
                      <td key={column.id}>
                        {column.render ? column.render(value, row) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && !error && sortedData.length > 0 && (
        <div className="data-grid__pagination" role="navigation" aria-label="Table pagination">
          <label className="data-grid__page-size">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <span>
            Page {safePage + 1} of {totalPages}
          </span>
          <div className="data-grid__page-buttons">
            <button type="button" disabled={safePage === 0} onClick={() => setPage(0)} aria-label="First page">
              «
            </button>
            <button type="button" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              ‹
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              ›
            </button>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(totalPages - 1)}
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
