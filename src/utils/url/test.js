// @flow
/* eslint-env mocha */
import {expect} from 'chai';
import {removeLastSlash, buildLink, buildAnchorLink} from '.';

describe('url utils', () => {
  describe('removeLastSlash', () => {
    it('should remove last slash of a string', () => {
      expect(removeLastSlash('')).to.equal('');
      expect(removeLastSlash('/')).to.equal('');
      expect(removeLastSlash('///')).to.equal('');
      expect(removeLastSlash('/some/url')).to.equal('/some/url');
      expect(removeLastSlash('/some/url/')).to.equal('/some/url');
    });
  });

  describe('buildLink', () => {
    it('should build a valid link href', () => {
      for (const path of ['/some/path', '/some/path/', '/some/path//']) {
        expect(buildLink(path)).to.equal('/some/path/');
        for (const [from, o] of [['path', '/some/path/'], ['some', '/some/']]) {
          expect(buildLink(path, from)).to.equal(o);
          expect(buildLink(path, from, 'a')).to.equal(`${o}a/`);
          expect(buildLink(path, from, 'a', 'b', 'c')).to.equal(`${o}a/b/c/`);
        }
      }
    });
  });

  describe('buildAnchorLink', () => {
    it('should build a valid anchor link href', () => {
      expect(buildAnchorLink('/some/url/')).to.equal('/some/url/#');
      expect(buildAnchorLink('/some/url/', 'anchor'))
        .to.equal('/some/url/#anchor');
    });
  });
});
