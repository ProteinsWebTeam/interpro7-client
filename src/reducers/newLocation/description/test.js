import reducer, { getDefaultDescription } from './index';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

describe('reducer for location description', () => {
  let defaultDescription;

  beforeAll(() => (defaultDescription = getDefaultDescription()));

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(defaultDescription);
  });

  it('should handle NEW_PROCESSED_NEW_LOCATION action', () => {
    expect(
      reducer(defaultDescription, {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: { description: { mainType: 'entry' } },
      }),
    ).toEqual({ ...defaultDescription, mainType: 'entry' });
    expect(
      reducer(defaultDescription, {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: { description: {} },
      }),
    ).toEqual(defaultDescription);
  });

  it('should ignore everything else', () => {
    expect(reducer(defaultDescription, {})).toBe(defaultDescription);
  });
});
