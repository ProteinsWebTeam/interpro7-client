import reducer from '.';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

describe('reducer for location search', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle NEW_PROCESSED_NEW_LOCATION action', () => {
    expect(
      reducer(
        {},
        {
          type: NEW_PROCESSED_NEW_LOCATION,
          newLocation: { search: { query: 'a' } },
        },
      ),
    ).toEqual({ query: 'a' });
    expect(
      reducer(
        { query: 'a' },
        {
          type: NEW_PROCESSED_NEW_LOCATION,
          newLocation: { search: { query: 'a' } },
        },
      ),
    ).toEqual({ query: 'a' });
    expect(
      reducer({}, { type: NEW_PROCESSED_NEW_LOCATION, newLocation: {} }),
    ).toEqual({});
    expect(
      reducer(
        { query: 'a' },
        { type: NEW_PROCESSED_NEW_LOCATION, newLocation: {} },
      ),
    ).toEqual({});
  });

  it('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
