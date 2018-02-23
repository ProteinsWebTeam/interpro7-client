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
    const types = ['entry', 'protein', 'structure', 'organism', 'set'];
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
});
