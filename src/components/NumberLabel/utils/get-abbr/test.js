// @flow
/* eslint-disable no-magic-numbers */
import getAbbr from '.';

describe('getAbbr', () => {
  test('should just format small numbers', () => {
    expect(getAbbr(0)).toBe('0');
    expect(getAbbr(1)).toBe('1');
    expect(getAbbr(2)).toBe('2');
    expect(getAbbr(999)).toBe('999');
  });

  test('should just format and round down bigger numbers', () => {
    expect(getAbbr(1e3)).toBe('1k');
    expect(getAbbr(1001)).toBe('1k');
    expect(getAbbr(1234)).toBe('1k');
    // TODO: check if next line is really what we want
    expect(getAbbr(9999)).toBe('9k');
    expect(getAbbr(1e6)).toBe('1M');
    expect(getAbbr(2e6)).toBe('2M');
  });
});
