import { describe, expect, it } from 'vitest';
import { EMPTY_FORM_VALUES } from './types';
import { getFirstErrorField, validateEventForm } from './validation';

describe('validateEventForm', () => {
  it('requires a non-empty title', () => {
    const errors = validateEventForm({ ...EMPTY_FORM_VALUES, title: '  ' });
    expect(errors.title).toBe('Title is required.');
  });

  it('requires title to be at least 3 characters', () => {
    const errors = validateEventForm({ ...EMPTY_FORM_VALUES, title: 'ab', date: '2026-06-15' });
    expect(errors.title).toBe('Title must be at least 3 characters.');
  });

  it('requires a date', () => {
    const errors = validateEventForm({ ...EMPTY_FORM_VALUES, title: 'Valid title', date: '' });
    expect(errors.date).toBe('Date is required.');
  });

  it('returns no errors for valid values', () => {
    const errors = validateEventForm({
      ...EMPTY_FORM_VALUES,
      title: 'Camera check',
      date: '2026-06-15',
    });
    expect(errors).toEqual({});
  });
});

describe('getFirstErrorField', () => {
  it('returns the first field in validation order', () => {
    expect(getFirstErrorField({ title: 'err', date: 'err' })).toBe('title');
    expect(getFirstErrorField({ date: 'err' })).toBe('date');
  });

  it('returns null when there are no errors', () => {
    expect(getFirstErrorField({})).toBeNull();
  });
});
