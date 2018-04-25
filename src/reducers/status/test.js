import { statusSelector } from '.';

describe('selectors', () => {
  test('statusSelector', () => {
    const state = { status: {} };
    expect(statusSelector(state)).toBe(state.status);
  });
});
