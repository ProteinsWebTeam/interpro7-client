import reducer from './index';
import { NEW_PROCESSED_NEW_LOCATION } from 'actions/types';

describe('reducer for location hash', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toBe('');
  });

  it('should handle NEW_PROCESSED_NEW_LOCATION action', () => {
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

  it('should ignore everything else', () => {
    expect(reducer('untouched', {})).toBe('untouched');
  });
});
