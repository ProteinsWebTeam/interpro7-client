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

  test('ignore if existing page', () => {
    expect(toPlural('word', 0, true)).toBe('word');
    expect(toPlural('word', 1, true)).toBe('word');
    expect(toPlural('word', 2, true)).toBe('words');
  });

  test('ignore if existing page, already in plural', () => {
    expect(toPlural('words', 0, true)).toBe('word');
    expect(toPlural('words', 1, true)).toBe('word');
    expect(toPlural('words', 2, true)).toBe('words');
  });

  test('clean up string', () => {
    expect(toPlural(' word ', 0, true)).toBe('word');
    expect(toPlural('   word', 2, true)).toBe('words');
    expect(toPlural('   entry ', 2, true)).toBe('entries');
  });
});
