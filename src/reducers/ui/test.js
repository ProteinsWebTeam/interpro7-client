import { uiSelector } from '.';

describe('selectors', () => {
  test('uiSelector', () => {
    const state = { ui: {} };
    expect(uiSelector(state)).toBe(state.ui);
  });
});
