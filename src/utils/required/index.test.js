/* eslint-env mocha */

import {expect} from 'chai';

import required from '.';

describe('required parameter helper', () => {
  it('always throw when called', () => {
    expect(required).to.throw(Error, 'parameter is a required parameter');
    expect(() => required('input')).to.throw(
      Error,
      'input is a required parameter'
    );
  });
});
