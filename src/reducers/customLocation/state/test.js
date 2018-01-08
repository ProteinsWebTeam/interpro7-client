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
          state: { someValue: true },
        },
      ),
    ).toEqual({ someValue: true });
    expect(
      reducer(
        { someValue: true },
        {
          type: NEW_PROCESSED_CUSTOM_LOCATION,
          state: { someValue: false },
        },
      ),
    ).toEqual({ someValue: false });
    expect(reducer({}, { type: NEW_PROCESSED_CUSTOM_LOCATION })).toEqual({});
    expect(
      reducer({ someValue: true }, { type: NEW_PROCESSED_CUSTOM_LOCATION }),
    ).toEqual({});
  });

  test('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
