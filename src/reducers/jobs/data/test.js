// @flow
import reducer from '.';
import { LOAD_DATA_JOB, UNLOAD_DATA_JOB } from 'actions/types';

const testData1 = { sequence: 'MITIDGNGAV' };
const testData2 = { go: ['1', '2'] };

describe('reducer for job data', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBeUndefined();
  });

  test('should handle LOAD_DATA_JOB action', () => {
    const result1 = reducer(undefined, {
      type: LOAD_DATA_JOB,
      job: { data: testData1 },
    });
    expect(result1).toEqual(testData1);
    expect(result1).not.toBe(testData1); // Should have done a shallow copy
    const result2 = reducer(testData1, {
      type: LOAD_DATA_JOB,
      job: { data: testData2 },
    });
    expect(result2).toEqual({ ...testData1, ...testData2 });
  });

  test('should handle UNLOAD_DATA_JOB action', () => {
    expect(reducer(undefined, { type: UNLOAD_DATA_JOB })).toBeUndefined();
    expect(reducer(testData1, { type: UNLOAD_DATA_JOB })).toBeUndefined();
  });

  test('should ignore everything else', () => {
    expect(reducer(testData1, {})).toBe(testData1);
  });
});
