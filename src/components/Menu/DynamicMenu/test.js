import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import DynamicMenu from '.';

const renderer = new ShallowRenderer();

describe('<DynamicMenu />', () => {
  test('should render', () => {
    renderer.render(<DynamicMenu width={500} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
