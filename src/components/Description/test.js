// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Description from '.';

const renderer = new ShallowRenderer();

describe('<Description />', () => {
  test('should render', () => {
    renderer.render(<Description textBlocks={['a', 'b', 'c']} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
