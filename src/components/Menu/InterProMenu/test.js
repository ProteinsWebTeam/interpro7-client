import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import InterProMenu from '.';

const renderer = new ShallowRenderer();

describe('<InterProMenu />', () => {
  test('should render', () => {
    renderer.render(<InterProMenu />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
