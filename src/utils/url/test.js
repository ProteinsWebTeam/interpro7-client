// @flow
import { removeLastSlash, buildLink, buildAnchorLink } from '.';

describe('url utils', () => {
  describe('removeLastSlash', () => {
    test('should remove last slash of a string', () => {
      expect(removeLastSlash('')).toBe('');
      expect(removeLastSlash('/')).toBe('');
      expect(removeLastSlash('///')).toBe('');
      expect(removeLastSlash('/some/url')).toBe('/some/url');
      expect(removeLastSlash('/some/url/')).toBe('/some/url');
    });
  });

  describe('buildLink', () => {
    test('should build a valid link href', () => {
      for (const path of ['/some/path', '/some/path/', '/some/path//']) {
        expect(buildLink(path)).toBe('/some/path/');
        for (const [from, o] of [['path', '/some/path/'], ['some', '/some/']]) {
          expect(buildLink(path, from)).toBe(o);
          expect(buildLink(path, from, 'a')).toBe(`${o}a/`);
          expect(buildLink(path, from, 'a', 'b', 'c')).toBe(`${o}a/b/c/`);
        }
      }
    });
  });

  describe('buildAnchorLink', () => {
    test('should build a valid anchor link href', () => {
      expect(buildAnchorLink('/some/url/')).toBe('/some/url/#');
      expect(buildAnchorLink('/some/url/', 'anchor')).toBe('/some/url/#anchor');
    });
  });
});
