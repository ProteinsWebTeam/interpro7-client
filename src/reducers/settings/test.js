import reducer, { getDefaultSettings } from '.';
import { CHANGE_SETTINGS, RESET_SETTINGS } from 'actions/types';

describe('reducer for settings', () => {
  let defaultSettings;

  beforeAll(() => (defaultSettings = getDefaultSettings()));

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
      }).cache.enabled
    ).toBe(true);
    expect(
      reducer(defaultSettings, {
        type: CHANGE_SETTINGS,
        category: 'cache',
        key: 'enabled',
        value: false,
      }).cache.enabled
    ).toBe(false);
  });

  test('should handle RESET_SETTINGS action', () => {
    expect(reducer({}, { type: RESET_SETTINGS })).toEqual(defaultSettings);
    expect(
      reducer({}, { type: RESET_SETTINGS, value: { setting: 'value' } })
    ).toEqual({ setting: 'value' });
  });

  test('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
