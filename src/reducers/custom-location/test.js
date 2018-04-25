import { customLocationSelector } from '.';

describe('selectors', () => {
  test('customLocationSelector', () => {
    const state = { customLocation: {} };
    expect(customLocationSelector(state)).toBe(state.customLocation);
  });
});
