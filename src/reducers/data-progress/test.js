import reducer from '.';
import { PROGRESS_DATA, UNLOAD_DATA } from 'actions/types';

describe('reducer for data progress handling in state', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('should handle PROGRESS_DATA action', () => {
    expect(
      reducer(
        {},
        { type: PROGRESS_DATA, key: 'id1', progress: 0.5, weight: 1 },
      ),
    ).toEqual({
      id1: { progress: 0.5, weight: 1 },
    });
    expect(
      reducer(
        { id1: { progress: 0.5, weight: 1 } },
        { type: PROGRESS_DATA, key: 'id2', progress: 0.3, weight: 1 },
      ),
    ).toEqual({
      id1: { progress: 0.5, weight: 1 },
      id2: { progress: 0.3, weight: 1 },
    });
    const untouched = {
      id1: { progress: 1, weight: 1 },
      id2: { progress: 0.3, weight: 1 },
    };
    expect(
      reducer(untouched, {
        type: PROGRESS_DATA,
        key: 'id1',
        progress: 1,
        weight: 1,
      }),
    ).toBe(untouched);
  });

  test('should handle UNLOAD_DATA action', () => {
    expect(
      reducer(
        { id1: { progress: 1, weight: 1 } },
        { type: UNLOAD_DATA, key: 'id1' },
      ),
    ).toEqual({});
    expect(
      reducer(
        { id1: { progress: 1, weight: 1 }, id2: { progress: 1, weight: 1 } },
        { type: UNLOAD_DATA, key: 'id2' },
      ),
    ).toEqual({ id1: { progress: 1, weight: 1 } });
  });
});
