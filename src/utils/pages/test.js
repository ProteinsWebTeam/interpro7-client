// @flow
import { toPlural } from '.';

describe('toPlural', () => {
  test('entry', () => {
    expect(toPlural('entry')).toBe('entries');
    expect(toPlural('entry', 0)).toBe('entry');
    expect(toPlural('entry', 1)).toBe('entry');
    expect(toPlural('entry', 2)).toBe('entries');
  });

  test('structure', () => {
    expect(toPlural('structure')).toBe('structures');
    expect(toPlural('structure', 0)).toBe('structure');
    expect(toPlural('structure', 1)).toBe('structure');
    expect(toPlural('structure', 2)).toBe('structures');
  });

  test('gibberish', () => {
    expect(() => toPlural('gibberish')).toThrowError('Not an existing page');
  });
});
