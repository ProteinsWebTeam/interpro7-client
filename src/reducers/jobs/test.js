// @flow
import reducer from '.';
import { DELETE_JOB, REHYDRATE_JOBS } from 'actions/types';

describe('reducer for job', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('should handle DELETE_JOB action', () => {
    expect(
      reducer(
        { 'local-id-1': {} },
        {
          type: DELETE_JOB,
          job: { metadata: { localID: 'local-id-1' } },
        },
      ),
    ).toEqual({});
    expect(
      reducer(
        { 'local-id-1': {} },
        {
          type: DELETE_JOB,
          job: { metadata: { localID: 'local-id-2' } },
        },
      ),
    ).toEqual({ 'local-id-1': {} });
    expect(
      reducer(
        { 'local-id-1': {}, 'local-id-2': {} },
        {
          type: DELETE_JOB,
          job: { metadata: { localID: 'local-id-2' } },
        },
      ),
    ).toEqual({ 'local-id-1': {} });
  });

  test('should handle REHYDRATE_JOBS action', () => {
    expect(
      reducer(undefined, {
        type: REHYDRATE_JOBS,
        jobs: { 'local-id-1': {}, 'local-id-2': {} },
      }),
    ).toEqual({ 'local-id-1': {}, 'local-id-2': {} });
    expect(
      reducer(
        { 'local-id-1': {} },
        {
          type: REHYDRATE_JOBS,
          jobs: { 'local-id-2': {} },
        },
      ),
    ).toEqual({ 'local-id-1': {}, 'local-id-2': {} });
  });

  test('should ignore everything else', () => {
    const state = {};
    expect(reducer(state, {})).toBe(state);
  });
});
