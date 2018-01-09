// @flow
import reducer from '.';
import { STUCK, UNSTUCK } from 'actions/types';

describe('reducer for header stickyness', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBe(false);
  });

  test('should handle STUCK action', () => {
    expect(reducer(true, { type: STUCK })).toBe(true);
    expect(reducer(false, { type: STUCK })).toBe(true);
  });

  test('should handle UNSTUCK action', () => {
    expect(reducer(true, { type: UNSTUCK })).toBe(false);
    expect(reducer(false, { type: UNSTUCK })).toBe(false);
  });

  test('should ignore everything else', () => {
    expect(reducer(true, {})).toBe(true);
    expect(reducer(false, {})).toBe(false);
  });
});
