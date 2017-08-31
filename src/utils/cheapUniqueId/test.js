// @flow
import cheapUniqueId from '.';

const LOOP_SIZE = 500;

describe('cheapUniqueId helper function', () => {
  test('should provide unique ids', () => {
    const set = new Set();
    for (let index = 0; index < LOOP_SIZE; index++) {
      set.add(cheapUniqueId());
    }
    expect(set.size).toBe(LOOP_SIZE);
  });

  test('ids should be strings', () => {
    const id = cheapUniqueId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});
