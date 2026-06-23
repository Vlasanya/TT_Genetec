import { useCallback, useState } from 'react';
import type { EventFormValues } from './types';

export interface EventFormDialogState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialValues?: Partial<EventFormValues>;
  formKey: number;
}

export function useEventFormDialog() {
  const [state, setState] = useState<EventFormDialogState>({
    isOpen: false,
    mode: 'add',
    initialValues: undefined,
    formKey: 0,
  });

  const openAdd = useCallback(() => {
    setState((current) => ({
      isOpen: true,
      mode: 'add',
      initialValues: undefined,
      formKey: current.formKey + 1,
    }));
  }, []);

  const openEdit = useCallback((initialValues: Partial<EventFormValues>) => {
    setState((current) => ({
      isOpen: true,
      mode: 'edit',
      initialValues,
      formKey: current.formKey + 1,
    }));
  }, []);

  const close = useCallback(() => {
    setState((current) => ({ ...current, isOpen: false, initialValues: undefined }));
  }, []);

  return {
    isOpen: state.isOpen,
    mode: state.mode,
    initialValues: state.initialValues,
    formKey: state.formKey,
    openAdd,
    openEdit,
    close,
  };
}
