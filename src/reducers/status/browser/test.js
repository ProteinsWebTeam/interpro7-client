import reducer, { browserStatusSelector } from '.';
import { BROWSER_STATUS, TEST } from 'actions/types';

describe('reducer for browser status', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, { type: TEST })).toBe(window.navigator.onLine);
  });

  test('should handle NEW_PROCESSED_CUSTOM_LOCATION action', () => {
    expect(reducer(true, { type: BROWSER_STATUS, onLine: true })).toBe(true);
    expect(reducer(true, { type: BROWSER_STATUS, onLine: false })).toBe(false);
    expect(reducer(false, { type: BROWSER_STATUS, onLine: true })).toBe(true);
    expect(reducer(false, { type: BROWSER_STATUS, onLine: false })).toBe(false);
  });

  test('should ignore everything else', () => {
    expect(reducer(true, { type: TEST })).toBe(true);
    expect(reducer(false, { type: TEST })).toBe(false);
  });
});

describe('selectors', () => {
  test('browserStatusSelector', () => {
    expect(browserStatusSelector({ status: { browser: true } })).toBe(true);
  });
});
