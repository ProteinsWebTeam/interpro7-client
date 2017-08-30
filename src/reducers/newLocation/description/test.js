import reducer, { getDefaultDescription } from '.';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

describe('reducer for location description', () => {
  let defaultDescription;

  beforeAll(() => (defaultDescription = getDefaultDescription()));

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultDescription);
  });

  test('should handle NEW_PROCESSED_NEW_LOCATION action', () => {
    expect(
      reducer(defaultDescription, {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: { description: { mainType: 'entry' } },
      })
    ).toEqual({ ...defaultDescription, mainType: 'entry' });
    expect(
      reducer(defaultDescription, {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: { description: {} },
      })
    ).toEqual(defaultDescription);
  });

  test('should ignore everything else', () => {
    expect(reducer(defaultDescription, {})).toBe(defaultDescription);
  });
});
