// @flow
import generateRel from '.';

describe('generateRel', () => {
  describe('no href', () => {
    test('rel defined', () => {
      expect(generateRel('rel', undefined, undefined)).toBe('rel');
    });

    test('rel undefined', () => {
      expect(generateRel(undefined, undefined, undefined)).toBeUndefined();
    });
  });

  describe('href, but no target', () => {
    test('rel defined', () => {
      expect(generateRel('rel', undefined, '/url/')).toBe('rel noreferrer');
      expect(generateRel('rel1 rel2', undefined, '/url/')).toBe(
        'rel1 rel2 noreferrer',
      );
    });

    test('rel defined with noreferrer', () => {
      expect(generateRel('noreferrer', undefined, '/url/')).toBe('noreferrer');
      expect(generateRel('rel noreferrer', undefined, '/url/')).toBe(
        'rel noreferrer',
      );
    });

    test('rel undefined', () => {
      expect(generateRel(undefined, undefined, '/url/')).toBe('noreferrer');
    });
  });

  describe('href and target', () => {
    test('rel defined', () => {
      expect(generateRel('rel', '_blank', '/url/')).toBe(
        'rel noreferrer noopener',
      );
      expect(generateRel('rel1 rel2', '_blank', '/url/')).toBe(
        'rel1 rel2 noreferrer noopener',
      );
    });

    test('rel defined with noreferrer', () => {
      expect(generateRel('noreferrer', '_blank', '/url/')).toBe(
        'noreferrer noopener',
      );
      expect(generateRel('rel noreferrer', '_blank', '/url/')).toBe(
        'rel noreferrer noopener',
      );
    });

    test('rel undefined', () => {
      expect(generateRel(undefined, '_blank', '/url/')).toBe(
        'noreferrer noopener',
      );
    });
  });
});
