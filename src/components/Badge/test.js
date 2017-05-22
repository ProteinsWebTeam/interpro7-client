/* eslint-env node */
/* eslint-env mocha */
import 'babel-polyfill';

import React from 'react';
import {createRenderer} from 'react-dom/test-utils';
import chai, {expect} from 'chai';
import jsxChai from 'jsx-chai';

import Badge from '.';
import style from './style.css';

chai.use(jsxChai);
const renderer = createRenderer();

describe('<Badge />', () => {
  it('should render the badge component', () => {
    renderer.render(
      <Badge>text</Badge>
    );
    expect(renderer.getRenderOutput()).to.deep.equal(
      <span className={style.badge} title="text">text</span>
    );
    renderer.render(
      <Badge>{12345}</Badge>
    );
    expect(renderer.getRenderOutput()).to.deep.equal(
      <span className={style.badge} title={12345}>{12345}</span>
    );
    renderer.render(
      <Badge title="test title">text with title</Badge>
    );
    expect(renderer.getRenderOutput()).to.deep.equal(
      <span className={style.badge} title="test title">text with title</span>
    );
  });
});
