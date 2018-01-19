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

  test('should provide ids with optional namespace', () => {
    expect(cheapUniqueId('namespace')).toMatch(/^namespace-[1-9]\d*$/);
    // eslint-disable-next-line no-magic-numbers
    expect(cheapUniqueId(1234)).toMatch(/^1234-[1-9]\d*$/);
  });

  test('ids should be strings', () => {
    const id = cheapUniqueId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});
