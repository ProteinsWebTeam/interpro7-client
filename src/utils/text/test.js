/* @flow */
/* eslint-env mocha */
import {expect} from 'chai';

import {transformFormatted} from '.';

describe('text utils', () => {
  describe('transformFormatted', () => {
    it('should split a text following internal <p> tags', () => {
      const tests = [
        {i: '', o: []},
        {i: 'abc def', o: ['abc def']},
        {i: '<p>abc</p><p>def</p>', o: ['abc', 'def']},
        {i: '<p>abc </p>    <p>  def </p>', o: ['abc', 'def']},
        {
          i: '<p>abc </p> non paragraphed <p>  def </p>',
          o: ['abc', 'non paragraphed', 'def'],
        },
      ];
      for (const {i, o} of tests) {
        expect(transformFormatted(i)).to.deep.equal(o);
      }
    });
  });
});
