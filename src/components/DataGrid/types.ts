import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface DataGridColumn<T> {
  id: string;
  label: string;
  accessor: keyof T | ((row: T) => unknown);
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
}

export interface DataGridSortState {
  columnId: string;
  direction: Exclude<SortDirection, null>;
}

export interface DataGridProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataGridColumn<T>[];
  rowKey: keyof T | ((row: T) => string);
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  skeleton?: boolean;
  skeletonRows?: number;
  error?: string | null;
  emptyMessage?: string;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onRowClick?: (row: T) => void;
  className?: string;
}
