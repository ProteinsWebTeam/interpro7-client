/* eslint-disable no-magic-numbers */
import reducer, {
  dataProgressSelector,
  overallDataProgressSelector,
  overallDataLoadingSelector,
} from '.';
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

describe('selectors', () => {
  test('dataProgressSelector', () => {
    const state = { dataProgress: {} };
    expect(dataProgressSelector(state)).toBe(state.dataProgress);
  });

  describe('overallDataProgressSelector', () => {
    test('no data', () => {
      expect(overallDataProgressSelector({ dataProgress: {} })).toBe(1);
    });

    test('one datum', () => {
      let state = { dataProgress: { a: { progress: 0, weight: 1 } } };
      expect(overallDataProgressSelector(state)).toBe(0);
      state = { dataProgress: { a: { progress: 0.5, weight: 1 } } };
      expect(overallDataProgressSelector(state)).toBe(0.5);
      state = { dataProgress: { a: { progress: 1, weight: 1 } } };
      expect(overallDataProgressSelector(state)).toBe(1);
      state = { dataProgress: { a: { progress: 0.5, weight: 2 } } };
      expect(overallDataProgressSelector(state)).toBe(0.5);
      state = { dataProgress: { a: { progress: 1, weight: 2 } } };
      expect(overallDataProgressSelector(state)).toBe(1);
    });

    test('multiple data', () => {
      let state = {
        dataProgress: {
          a: { progress: 0, weight: 1 },
          b: { progress: 0, weight: 1 },
        },
      };
      expect(overallDataProgressSelector(state)).toBe(0);
      state = {
        dataProgress: {
          a: { progress: 0.5, weight: 1 },
          b: { progress: 1, weight: 3 },
        },
      };
      expect(overallDataProgressSelector(state)).toBe(0.875);
      state = {
        dataProgress: {
          a: { progress: 1, weight: 1 },
          b: { progress: 1, weight: 3 },
        },
      };
      expect(overallDataProgressSelector(state)).toBe(1);
      state = {
        dataProgress: {
          a: { progress: 0, weight: 2 },
          b: { progress: 1, weight: 2 },
        },
      };
      expect(overallDataProgressSelector(state)).toBe(0.5);
    });
  });

  describe('overallDataLoadingSelector', () => {
    test('no data', () => {
      expect(overallDataLoadingSelector({ dataProgress: {} })).toBe(false);
    });

    test('one datum', () => {
      let state = { dataProgress: { a: { progress: 0, weight: 1 } } };
      expect(overallDataLoadingSelector(state)).toBe(true);
      state = { dataProgress: { a: { progress: 0.5, weight: 1 } } };
      expect(overallDataLoadingSelector(state)).toBe(true);
      state = { dataProgress: { a: { progress: 1, weight: 1 } } };
      expect(overallDataLoadingSelector(state)).toBe(false);
      state = { dataProgress: { a: { progress: 0.5, weight: 2 } } };
      expect(overallDataLoadingSelector(state)).toBe(true);
      state = { dataProgress: { a: { progress: 1, weight: 2 } } };
      expect(overallDataLoadingSelector(state)).toBe(false);
    });

    test('multiple data', () => {
      let state = {
        dataProgress: {
          a: { progress: 0, weight: 1 },
          b: { progress: 0, weight: 1 },
        },
      };
      expect(overallDataLoadingSelector(state)).toBe(true);
      state = {
        dataProgress: {
          a: { progress: 0.5, weight: 1 },
          b: { progress: 1, weight: 3 },
        },
      };
      expect(overallDataLoadingSelector(state)).toBe(true);
      state = {
        dataProgress: {
          a: { progress: 1, weight: 1 },
          b: { progress: 1, weight: 3 },
        },
      };
      expect(overallDataLoadingSelector(state)).toBe(false);
      state = {
        dataProgress: {
          a: { progress: 0, weight: 2 },
          b: { progress: 1, weight: 2 },
        },
      };
      expect(overallDataLoadingSelector(state)).toBe(true);
    });
  });
});
