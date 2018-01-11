// @flow
import reducer, { updateJob } from '.';
import { CREATE_JOB, UPDATE_JOB } from 'actions/types';

const TIMESTAMP_MARGIN = 2000; // 2 seconds margin

describe('reducer for job metadata', () => {
  const testPartMetadata1 = { localID: '1', status: 'created' };
  let testMetadata1;
  let testMetadata2;

  beforeAll(() => {
    testMetadata1 = updateJob(testPartMetadata1);
    testMetadata2 = updateJob({ ...testPartMetadata1, status: 'submitted' });
  });

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toBeUndefined();
  });

  test('should handle CREATE_JOB action', () => {
    const result1 = reducer(undefined, {
      type: CREATE_JOB,
      job: { metadata: testPartMetadata1 },
    });
    for (const [key, value] of Object.entries(result1)) {
      if (key === 'times') {
        for (const [key, time] of Object.entries(value)) {
          expect(Math.floor(time / TIMESTAMP_MARGIN)).toBe(
            Math.floor(testMetadata1.times[key] / TIMESTAMP_MARGIN),
          );
        }
        continue;
      }
      expect(value).toBe(testMetadata1[key]);
    }
  });

  test('should handle UPDATE_JOB action', () => {
    const result1 = reducer(testMetadata1, {
      type: UPDATE_JOB,
      job: { metadata: { ...testPartMetadata1, status: 'submitted' } },
    });
    for (const [key, value] of Object.entries(result1)) {
      if (key === 'times') {
        for (const [key, time] of Object.entries(value)) {
          expect(Math.floor(time / TIMESTAMP_MARGIN)).toBe(
            Math.floor(testMetadata2.times[key] / TIMESTAMP_MARGIN),
          );
        }
        continue;
      }
      expect(value).toBe(testMetadata2[key]);
    }
  });

  test('should ignore everything else', () => {
    expect(reducer(testMetadata1, {})).toBe(testMetadata1);
  });
});
