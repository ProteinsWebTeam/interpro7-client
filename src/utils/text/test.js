// @flow
import { transformFormatted } from '.';

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
});
