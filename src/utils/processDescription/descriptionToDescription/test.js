// @flow
import { merge, mergeWith, cloneDeep, toPlainObject } from 'lodash-es';

import descriptionToDescription from '.';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

const arrayToObject = (objValue, srcValue) => {
  if (Array.isArray(srcValue)) {
    return merge(objValue, toPlainObject(srcValue));
  }
};

describe('descriptionToDescription', () => {
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
});
