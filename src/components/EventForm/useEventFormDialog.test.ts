import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEventFormDialog } from './useEventFormDialog';

describe('useEventFormDialog', () => {
  it('opens add and edit modes', () => {
    const { result } = renderHook(() => useEventFormDialog());

    expect(result.current.isOpen).toBe(false);

    act(() => result.current.openAdd());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe('add');
    expect(result.current.initialValues).toBeUndefined();

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.openEdit({ title: 'Existing', date: '2026-06-10' }));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.mode).toBe('edit');
    expect(result.current.initialValues).toEqual({ title: 'Existing', date: '2026-06-10' });
  });
});
