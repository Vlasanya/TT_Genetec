import { useCallback, useState } from 'react';
import type { EventFormValues } from './types';

export interface EventFormDialogState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialValues?: Partial<EventFormValues>;
}

export function useEventFormDialog() {
  const [state, setState] = useState<EventFormDialogState>({
    isOpen: false,
    mode: 'add',
    initialValues: undefined,
  });

  const openAdd = useCallback(() => {
    setState({ isOpen: true, mode: 'add', initialValues: undefined });
  }, []);

  const openEdit = useCallback((initialValues: Partial<EventFormValues>) => {
    setState({ isOpen: true, mode: 'edit', initialValues });
  }, []);

  const close = useCallback(() => {
    setState((current) => ({ ...current, isOpen: false, initialValues: undefined }));
  }, []);

  return {
    isOpen: state.isOpen,
    mode: state.mode,
    initialValues: state.initialValues,
    openAdd,
    openEdit,
    close,
  };
}
