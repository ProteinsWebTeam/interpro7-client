// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Twitter from '.';

const renderer = new ShallowRenderer();

describe('<Twitter />', () => {
  test('should render', () => {
    renderer.render(<Twitter />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
