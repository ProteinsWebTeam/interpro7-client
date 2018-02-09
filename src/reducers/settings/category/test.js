import getReducerFor, { getDefaultSettingsFor } from './index';
import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types/index';

describe('reducer for settings', () => {
  let defaultSettings;
  let reducer;

  beforeAll(() => {
    defaultSettings = getDefaultSettingsFor('cache');
    reducer = getReducerFor('cache');
  });

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultSettings);
  });

  test('should handle CHANGE_SETTINGS action', () => {
    expect(
      reducer(defaultSettings, {
        type: CHANGE_SETTINGS,
        category: 'cache',
        key: 'enabled',
        value: true,
      }).enabled,
    ).toBe(true);
    expect(
      reducer(defaultSettings, {
        type: CHANGE_SETTINGS,
        category: 'cache',
        key: 'enabled',
        value: false,
      }).enabled,
    ).toBe(false);
  });

  test('should handle RESET_SETTINGS action', () => {
    expect(reducer({}, { type: RESET_SETTINGS })).toEqual(defaultSettings);
    expect(
      reducer({}, { type: RESET_SETTINGS, value: { setting: 'value' } }),
    ).toEqual({ setting: 'value' });
  });

  test('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
