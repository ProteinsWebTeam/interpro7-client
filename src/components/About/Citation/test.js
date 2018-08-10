// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Citation from '.';

const renderer = new ShallowRenderer();

describe('<Citation />', () => {
  test('should render', () => {
    renderer.render(<Citation />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
