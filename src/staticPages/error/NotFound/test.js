// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import NotFound from '.';

const renderer = new ShallowRenderer();

describe('<NotFound />', () => {
  test('should render', () => {
    renderer.render(<NotFound />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
