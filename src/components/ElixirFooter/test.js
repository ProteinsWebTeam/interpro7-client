// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ElixirFooter from '.';

const renderer = new ShallowRenderer();

describe('<ElixirFooter />', () => {
  test('should render', () => {
    renderer.render(<ElixirFooter />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
