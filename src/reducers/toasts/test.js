import reducer from '.';
import { ADD_TOAST, REMOVE_TOAST } from 'actions/types';

describe('reducer for toast messages', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('should handle ADD_TOAST action', () => {
    // add to empty
    expect(
      reducer({}, { type: ADD_TOAST, id: 'a', toast: { value: 'value-a' } })
    ).toEqual({ a: { value: 'value-a' } });
    // add to already existing
    expect(
      reducer(
        { a: { value: 'value-a' } },
        { type: ADD_TOAST, id: 'b', toast: { value: 'value-b' } }
      )
    ).toEqual({ a: { value: 'value-a' }, b: { value: 'value-b' } });
    // id clash
    expect(() =>
      reducer(
        { a: { value: 'value-a' } },
        { type: ADD_TOAST, id: 'a', toast: { value: 'value-b' } }
      )
    ).toThrow();
  });

  test('should handle REMOVE_TOAST action', () => {
    // remove existing
    expect(
      reducer(
        { a: { value: 'value-a' }, b: { value: 'value-b' } },
        { type: REMOVE_TOAST, id: 'a' }
      )
    ).toEqual({ b: { value: 'value-b' } });
    // try to remove non-existing
    expect(
      reducer({ a: { value: 'value-a' } }, { type: REMOVE_TOAST, id: 'b' })
    ).toEqual({ a: { value: 'value-a' } });
  });

  test('should ignore everything else', () => {
    const untouched = {};
    expect(reducer(untouched, {})).toBe(untouched);
  });
});
