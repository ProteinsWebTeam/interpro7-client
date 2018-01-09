// @flow
import reducer from '.';
import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';

describe('reducer for location hash', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBe('');
  });

  test('should handle NEW_PROCESSED_CUSTOM_LOCATION action', () => {
    expect(
      reducer('old_hash', {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: { hash: 'new_hash' },
      }),
    ).toBe('new_hash');
    expect(
      reducer('old_hash', {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: {},
      }),
    ).toBe('');
  });

  test('should ignore everything else', () => {
    expect(reducer('untouched', {})).toBe('untouched');
  });
});
