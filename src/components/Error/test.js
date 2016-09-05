/* eslint-env node */
/* eslint-env mocha */
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import Error from '.';

chai.use(jsxChai);
const renderer = createRenderer();

describe('<Error />', () => {
  it('should render errors', () => {
    renderer.render(<Error error={{message: 'Some test error'}} />);
    expect(renderer.getRenderOutput()).to.deep.equal(
      <div style={{backgroundColor: 'red'}}>Some test error</div>
    );
  });
  it('should render errors even when no message passed', () => {
    renderer.render(<Error error={{}} />);
    expect(renderer.getRenderOutput()).to.deep.equal(
      <div style={{backgroundColor: 'red'}}>Unknown error</div>
    );
  });
});
