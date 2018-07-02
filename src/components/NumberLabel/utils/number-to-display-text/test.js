// @flow
// For these tests, since they depend on `toLocaleString`, assume that the
// locale used is American English (default in node)
import numberToDisplayText from '.';

describe('numberToDisplayText', () => {
  test('no value', () => {
    expect(numberToDisplayText()).toBeUndefined();
    expect(numberToDisplayText(undefined)).toBeUndefined();
    expect(numberToDisplayText(null)).toBeUndefined();
    expect(numberToDisplayText('')).toBeUndefined();
  });

  test('invalid value', () => {
    expect(numberToDisplayText('a')).toBe('N/A');
    expect(numberToDisplayText('h87gr754hv')).toBe('N/A');
  });

  test('valid value, no abbr', () => {
    expect(numberToDisplayText(0)).toBe('0');
    expect(numberToDisplayText('0')).toBe('0');
    expect(numberToDisplayText(1)).toBe('1');
    expect(numberToDisplayText('1')).toBe('1');
    expect(numberToDisplayText(1000)).toBe('1,000');
    expect(numberToDisplayText('1000')).toBe('1,000');
    expect(numberToDisplayText(1234567)).toBe('1,234,567');
    expect(numberToDisplayText('1234567')).toBe('1,234,567');
  });

  test('valid value, abbr', () => {
    expect(numberToDisplayText(0, true)).toBe('0');
    expect(numberToDisplayText('0', true)).toBe('0');
    expect(numberToDisplayText(1, true)).toBe('1');
    expect(numberToDisplayText('1', true)).toBe('1');
    expect(numberToDisplayText(1000, true)).toBe('1k');
    expect(numberToDisplayText('1000', true)).toBe('1k');
    expect(numberToDisplayText(1234567, true)).toBe('1M');
    expect(numberToDisplayText('1234567', true)).toBe('1M');
    expect(numberToDisplayText(1234567, true, 1000)).toBe('1,234k');
    expect(numberToDisplayText('1234567', true, 1000)).toBe('1,234k');
  });
});
