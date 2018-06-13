// @flow
/* eslint-disable no-magic-numbers */
import { transformFormatted, unescape, subsetText, findStart } from '.';

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

  describe('subsetText', () => {
    const text = 'abcde';
    test('subset is same as full text', () => {
      expect(subsetText(text, 0, 5)).toBe(text);
      expect(subsetText(text, 0, 6)).toBe(text);
    });

    test('cut the beginning', () => {
      expect(subsetText(text, 1, 4)).toBe('…bcde');
      expect(subsetText(text, 1, 5)).toBe('…bcde');
    });

    test('cut the end', () => {
      expect(subsetText(text, 0, 4)).toBe('abcd…');
    });

    test('cut both start and end', () => {
      expect(subsetText(text, 1, 3)).toBe('…bcd…');
    });
  });

  describe('findStart', () => {
    const text = 'abcde';
    const findStartForHalf = findStart(0.5);
    expect(findStartForHalf).toBeInstanceOf(Function);

    test('no text to highlight', () => {
      expect(findStartForHalf(text, undefined, 3)).toBe(0);
      expect(findStartForHalf(text, undefined, 6)).toBe(0);
      expect(findStartForHalf(text, null, 3)).toBe(0);
      expect(findStartForHalf(text, null, 6)).toBe(0);
      expect(findStartForHalf(text, '', 3)).toBe(0);
      expect(findStartForHalf(text, '', 6)).toBe(0);
    });

    test('no match of text to highlight', () => {
      expect(findStartForHalf(text, 'z', 3)).toBe(0);
      expect(findStartForHalf(text, 'z', 6)).toBe(0);
    });

    test('small text', () => {
      expect(findStartForHalf(text, 'c', 4)).toBe(0);
      expect(findStartForHalf(text, 'c', 5)).toBe(0);
      expect(findStartForHalf(text, 'c', 6)).toBe(0);
    });

    test('text to highlight near the end', () => {
      expect(findStartForHalf(text, 'd', 2)).toBe(3);
      expect(findStartForHalf(text, 'd', 3)).toBe(2);
      expect(findStartForHalf(text, 'e', 1)).toBe(4);
    });

    test('text to highlight too close to the end', () => {
      expect(findStartForHalf(text, 'd', 3)).toBe(2);
      expect(findStartForHalf(text, 'cd', 3)).toBe(2);
      expect(findStartForHalf(text, 'd', 5)).toBe(0);
      expect(findStartForHalf('abcdefgh', 'g', 5)).toBe(3);
      expect(findStartForHalf('abcdefgh', 'g', 6)).toBe(2);
    });

    test('text to highlight in the middle', () => {
      expect(findStartForHalf(text, 'c', 1)).toBe(2);
      expect(findStartForHalf(text + text, 'c', 1)).toBe(2);
      expect(findStartForHalf(text, 'c', 2)).toBe(2);
      expect(findStartForHalf(text + text, 'c', 2)).toBe(2);
      expect(findStartForHalf(text, 'bc', 2)).toBe(1);
      expect(findStartForHalf(text, 'bcd', 3)).toBe(1);
    });
  });
});
