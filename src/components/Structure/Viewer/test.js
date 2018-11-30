// @flow
/* eslint-disable no-magic-numbers */
import getMapper from './proteinToStructureMapper';

describe('protein2structure mapper', () => {
  test('identity', () => {
    const mapper = getMapper([
      {
        protein_start: 1,
        protein_end: 2,
        structure_start: 1,
        structure_end: 2,
      },
    ]);
    expect(mapper(0)).toBe(0);
    expect(mapper(1)).toBe(1);
    expect(mapper(2)).toBe(2);
  });

  test('structure covers the second half', () => {
    const mapper = getMapper([
      {
        protein_start: 51,
        protein_end: 100,
        structure_start: 1,
        structure_end: 50,
      },
    ]);
    expect(mapper(51)).toBe(1);
    expect(mapper(100)).toBe(50);
    expect(mapper(52)).toBe(2);
  });
  test('structure has fragments', () => {
    const mapper = getMapper([
      {
        protein_start: 51,
        protein_end: 70,
        structure_start: 1,
        structure_end: 20,
      },
      {
        protein_start: 76,
        protein_end: 100,
        structure_start: 21,
        structure_end: 45,
      },
    ]);
    expect(mapper(51)).toBe(1);
    expect(mapper(70)).toBe(20);
    expect(mapper(71)).toBeGreaterThan(20);
    expect(mapper(71)).toBeLessThan(21);
    expect(mapper(76)).toBe(21);
    expect(mapper(100)).toBe(45);
  });
});
