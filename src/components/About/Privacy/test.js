// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Privacy from '.';

const renderer = new ShallowRenderer();

describe('<Privacy />', () => {
  test('should render', () => {
    renderer.render(<Privacy />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
