/* eslint-disable max-depth */
import { merge, mergeWith, cloneDeep, toPlainObject } from 'lodash-es';

import descriptionToDescription from '.';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

// Transforms an array into an object with keys corresponding to the array's
// indices, and merges it with existing object. to be used in 'mergeWith'
const arrayToObject = (objValue /*: Object */, srcValue /*: any */) => {
  if (Array.isArray(srcValue)) {
    return merge(objValue, toPlainObject(srcValue));
  }
};

describe('descriptionToDescription()', () => {
  const originalD = getEmptyDescription();
  let d;

  // cloning original description to unfreeze it
  beforeEach(() => (d = cloneDeep(originalD)));

  test('empty', () => {
    expect(descriptionToDescription({})).toEqual(d);
  });

  describe('other', () => {
    test('1 level', () => {
      const part = { other: ['help'] };
      expect(descriptionToDescription(part)).toEqual(
        mergeWith(d, part, arrayToObject),
      );
    });

    test('2 levels', () => {
      const part = { other: ['download', 'interproscan'] };
      expect(descriptionToDescription(part)).toEqual(
        mergeWith(d, part, arrayToObject),
      );
    });
  });

  describe('search', () => {
    test('base', () => {
      const part = { main: { key: 'search' } };
      expect(descriptionToDescription(part)).toEqual(merge(d, part));
    });

    test('with type', () => {
      const part = { main: { key: 'search' }, search: { type: 'text' } };
      expect(descriptionToDescription(part)).toEqual(merge(d, part));
    });
  });

  test('keep isFilter', () => {
    const types = [
      'entry',
      'protein',
      'structure',
      'taxonomy',
      'proteome',
      'set',
    ];
    for (const key of types) {
      const d = { main: { key } };
      expect(Object.values(descriptionToDescription(d)).find(v => v.isFilter))
        .toBeUndefined;
      for (const type of types) {
        const description = { ...d, [type]: { isFilter: true } };
        if (key === type) {
          expect(() => descriptionToDescription(description)).toThrow();
        } else {
          expect(descriptionToDescription(description)[type].isFilter).toBe(
            true,
          );
        }
      }
    }
  });

  test('order and numberOfFilters for 1 filter', () => {
    const types = [
      'entry',
      'protein',
      'structure',
      'taxonomy',
      'proteome',
      'set',
    ];
    for (const key of types) {
      const d = { main: { key } };
      expect(Object.values(descriptionToDescription(d)).find(v => v.isFilter))
        .toBeUndefined;
      for (const type of types) {
        const description = { ...d, [type]: { isFilter: true } };
        if (key === type) {
          expect(() => descriptionToDescription(description)).toThrow();
        } else {
          expect(
            descriptionToDescription(description).main.numberOfFilters,
          ).toBe(1);
          expect(descriptionToDescription(description)[type].order).toBe(1);
          description[type].order = 2;
          expect(descriptionToDescription(description)[type].order).toBe(2);
        }
      }
    }
  });

  test('order and numberOfFilters for 2 filters', () => {
    const types = [
      'entry',
      'protein',
      'structure',
      'taxonomy',
      'proteome',
      'set',
    ];
    for (const key of types) {
      const d = { main: { key } };
      expect(Object.values(descriptionToDescription(d)).find(v => v.isFilter))
        .toBeUndefined;
      for (const type of types) {
        const description = { ...d, [type]: { isFilter: true } };
        if (key === type) {
          expect(() => descriptionToDescription(description)).toThrow();
        } else {
          for (const subType of types) {
            if (type === subType) continue;
            const description2 = {
              ...d,
              [type]: { isFilter: true },
              [subType]: { isFilter: true },
            };
            if (key === type || key === subType) {
              expect(() => descriptionToDescription(description2)).toThrow();
            } else {
              expect(
                descriptionToDescription(description2).main.numberOfFilters,
              ).toBe(2);
              expect(
                descriptionToDescription(description2)[type].order,
              ).toBeGreaterThan(0);
              expect(
                descriptionToDescription(description2)[subType].order,
              ).toBeGreaterThan(0);
              description2[type].order = 1;
              description2[subType].order = 2;
              expect(descriptionToDescription(description2)[type].order).toBe(
                1,
              );
              expect(
                descriptionToDescription(description2)[subType].order,
              ).toBe(2);
              description2[type].order = 2;
              description2[subType].order = 1;
              expect(descriptionToDescription(description2)[type].order).toBe(
                2,
              );
              expect(
                descriptionToDescription(description2)[subType].order,
              ).toBe(1);
            }
          }
        }
      }
    }
  });
});
