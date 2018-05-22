// @flow
import { transformFormatted, unescape } from '.';

describe('text utils', () => {
  describe('transformFormatted', () => {
    test('should split a text following internal <p> tags', () => {
      const tests = [
        { i: '', o: [] },
        { i: 'abc def', o: ['abc def'] },
        { i: '<p>abc</p><p>def</p>', o: ['abc', 'def'] },
        { i: '<p>abc </p>    <p>  def </p>', o: ['abc', 'def'] },
        {
          i: '<p>abc </p> non paragraphed <p>  def </p>',
          o: ['abc', 'non paragraphed', 'def'],
        },
      ];
      for (const { i, o } of tests) {
        expect(transformFormatted(i)).toEqual(o);
      }
    });
  });

  describe('unescape', () => {
    test('should transform back escaped entities in a text', () => {
      expect(unescape('&lt;span&gt;text &amp; more text&lt;/span&gt;')).toBe(
        '<span>text & more text</span>',
      );
    });
  });
});
