import reducer from '.';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

describe('reducer for location hash', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBe('');
  });

  test('should handle NEW_PROCESSED_NEW_LOCATION action', () => {
    expect(
      reducer('old_hash', {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: { hash: 'new_hash' },
      }),
    ).toBe('new_hash');
    expect(
      reducer('old_hash', {
        type: NEW_PROCESSED_NEW_LOCATION,
        newLocation: {},
      }),
    ).toBe('');
  });

  test('should ignore everything else', () => {
    expect(reducer('untouched', {})).toBe('untouched');
  });
});
