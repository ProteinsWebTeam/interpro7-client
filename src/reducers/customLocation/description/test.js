import reducer from '.';
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

describe('reducer for location description', () => {
  let emptyDescription;

  beforeAll(() => (emptyDescription = getEmptyDescription()));

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(emptyDescription);
  });

  test('should handle NEW_PROCESSED_CUSTOM_LOCATION action', () => {
    expect(
      reducer(emptyDescription, {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: { description: { main: { key: 'entry' } } },
      }),
    ).toEqual({ ...emptyDescription, main: { key: 'entry' } });
    expect(
      reducer(emptyDescription, {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: { description: {} },
      }),
    ).toEqual(emptyDescription);
  });

  test('should ignore everything else', () => {
    expect(reducer(emptyDescription, {})).toBe(emptyDescription);
  });
});
