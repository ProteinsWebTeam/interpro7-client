// @flow
/* eslint-disable no-magic-numbers */
import random from '.';

const tester = (from, to, int) => () => {
  const value = random(from, to, int);
  expect(value).toBeGreaterThanOrEqual(from);
  expect(value).toBeLessThanOrEqual(to);
  if (int) {
    expect(Math.round(value)).toBe(value);
  }
};

describe('random helper function', () => {
  describe('float', () => {
    test('between 0 and 1', tester(0, 1));
    test('between -1 and 1', tester(-1, 1));
    test('between 1 and 2', tester(1, 2));
    test('between 0 and 100', tester(0, 100));
  });

  describe('integer', () => {
    test('between 0 and 1', tester(0, 1, true));
    test('between -1 and 1', tester(-1, 1, true));
    test('between 1 and 2', tester(1, 2, true));
    test('between 0 and 100', tester(0, 100, true));
  });
});
