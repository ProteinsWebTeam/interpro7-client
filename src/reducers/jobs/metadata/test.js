import reducer, { updateJob } from '.';
import { CREATE_JOB, UPDATE_JOB } from 'actions/types';

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
      if (key !== 'times') {
        expect(value).toBe(testMetadata1[key]);
        continue;
      }
      for (const [key, time] of Object.entries(value)) {
        if (testMetadata1.times[key]) {
          expect(time).toBeGreaterThan(0);
        } else {
          expect(time).toBeNull();
        }
      }
    }
  });

  test('should handle UPDATE_JOB action', () => {
    const result1 = reducer(testMetadata1, {
      type: UPDATE_JOB,
      job: { metadata: { ...testPartMetadata1, status: 'submitted' } },
    });
    for (const [key, value] of Object.entries(result1)) {
      if (key !== 'times') {
        expect(value).toBe(testMetadata2[key]);
        continue;
      }
      for (const [key, time] of Object.entries(value)) {
        if (testMetadata2.times[key]) {
          expect(time).toBeGreaterThan(0);
        } else {
          expect(time).toBeNull();
        }
      }
    }
  });

  test('should ignore everything else', () => {
    expect(reducer(testMetadata1, {})).toBe(testMetadata1);
  });
});
