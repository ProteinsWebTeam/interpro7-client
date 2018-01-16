// @flow
import reducer from '.';
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

describe('reducer for location search', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('should handle NEW_PROCESSED_CUSTOM_LOCATION action', () => {
    expect(
      reducer(
        {},
        {
          type: NEW_PROCESSED_CUSTOM_LOCATION,
          customLocation: { search: { query: 'a' } },
        },
      ),
    ).toEqual({ query: 'a' });
    expect(
      reducer(
        { query: 'a' },
        {
          type: NEW_PROCESSED_CUSTOM_LOCATION,
          customLocation: { search: { query: 'a' } },
        },
      ),
    ).toEqual({ query: 'a' });
    expect(
      reducer({}, { type: NEW_PROCESSED_CUSTOM_LOCATION, customLocation: {} }),
    ).toEqual({});
    expect(
      reducer(
        { query: 'a' },
        { type: NEW_PROCESSED_CUSTOM_LOCATION, customLocation: {} },
      ),
    ).toEqual({});
  });

  test('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
