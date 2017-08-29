import reducer, { alreadyLoadingError } from '.';
import {
  LOADING_DATA,
  LOADED_DATA,
  PROGRESS_DATA,
  FAILED_LOADING_DATA,
  UNLOADING_DATA,
} from 'actions/types';

describe('reducer for data handling in state', () => {
  const payload = { whatever: 'value' };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle LOADING_DATA action', () => {
    expect(reducer({}, { type: LOADING_DATA, key: 'a' })).toEqual({
      a: { loading: true, progress: 0, url: 'a' },
    });
    expect(reducer({ a: {} }, { type: LOADING_DATA, key: 'b' })).toEqual({
      a: {},
      b: { loading: true, progress: 0, url: 'b' },
    });
    expect(() => reducer({ a: {} }, { type: LOADING_DATA, key: 'a' })).toThrow(
      alreadyLoadingError
    );
  });

  it('should handle LOADED_DATA action', () => {
    expect(
      reducer(
        { a: { loading: true, progress: 0, url: 'a' } },
        { type: LOADED_DATA, key: 'a', payload, status: 200, ok: true }
      )
    ).toEqual({
      a: {
        loading: false,
        payload,
        status: 200,
        ok: true,
        progress: 1,
        url: 'a',
      },
    });
    expect(
      reducer(
        { a: {}, b: { loading: true, progress: 0, url: 'b' } },
        { type: LOADED_DATA, key: 'b', payload, status: 204, ok: true }
      )
    ).toEqual({
      a: {},
      b: {
        loading: false,
        payload,
        status: 204,
        ok: true,
        progress: 1,
        url: 'b',
      },
    });
  });

  it('should handle PROGRESS_DATA action', () => {
    expect(
      reducer(
        { a: { loading: true, progress: 0.3, url: 'a' } },
        { type: PROGRESS_DATA, key: 'a', progress: 0.5 }
      )
    ).toEqual({ a: { loading: true, progress: 0.5, url: 'a' } });
    expect(
      reducer(
        { a: {}, b: { loading: true, progress: 0.2, url: 'b' } },
        { type: PROGRESS_DATA, key: 'b', progress: 0.8 }
      )
    ).toEqual({ a: {}, b: { loading: true, progress: 0.8, url: 'b' } });
  });

  it('should handle FAILED_LOADING_DATA action', () => {
    expect(
      reducer(
        { a: { loading: true, progress: 0.3, url: 'a' } },
        { type: FAILED_LOADING_DATA, key: 'a', error: new Error() }
      )
    ).toEqual({
      a: {
        loading: false,
        error: new Error(),
        ok: false,
        progress: 1,
        url: 'a',
      },
    });
    expect(
      reducer(
        { a: {}, b: { loading: true, progress: 0.2, url: 'b' } },
        { type: FAILED_LOADING_DATA, key: 'b', error: new Error(), url: 'b' }
      )
    ).toEqual({
      a: {},
      b: {
        loading: false,
        error: new Error(),
        ok: false,
        progress: 1,
        url: 'b',
      },
    });
  });

  it('should handle UNLOADING_DATA action', () => {
    expect(reducer({ a: {} }, { type: UNLOADING_DATA, key: 'a' })).toEqual({});
    expect(
      reducer({ a: {}, b: {} }, { type: UNLOADING_DATA, key: 'b' })
    ).toEqual({ a: {} });
    expect(reducer({ b: {} }, { type: UNLOADING_DATA, key: 'a' })).toEqual({
      b: {},
    });
  });

  it('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
