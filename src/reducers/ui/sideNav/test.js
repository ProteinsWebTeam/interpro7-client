import reducer, { sideNavSelector } from '.';
import { TOGGLE_SIDE_NAV, CLOSE_EVERYTHING } from 'actions/types';

describe('reducer for side menu open state', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBe(false);
  });

  test('should handle TOGGLE_SIDE_NAV action', () => {
    expect(reducer(true, { type: TOGGLE_SIDE_NAV })).toBe(false);
    expect(reducer(true, { type: TOGGLE_SIDE_NAV, status: 'open' })).toBe(true);
    expect(reducer(false, { type: TOGGLE_SIDE_NAV, status: 'open' })).toBe(
      true,
    );
    expect(reducer(false, { type: TOGGLE_SIDE_NAV })).toBe(true);
    expect(reducer(true, { type: TOGGLE_SIDE_NAV, status: 'close' })).toBe(
      false,
    );
    expect(reducer(false, { type: TOGGLE_SIDE_NAV, status: 'close' })).toBe(
      false,
    );
  });

  test('should handle CLOSE_EVERYTHING action', () => {
    expect(reducer(true, { type: CLOSE_EVERYTHING })).toBe(false);
    expect(reducer(false, { type: CLOSE_EVERYTHING })).toBe(false);
  });

  test('should ignore everything else', () => {
    expect(reducer(true, {})).toBe(true);
    expect(reducer(false, {})).toBe(false);
  });
});

describe('selectors', () => {
  test('sideNavSelector', () => {
    const state = { ui: { sideNav: true } };
    expect(sideNavSelector(state)).toBe(true);
  });
});
