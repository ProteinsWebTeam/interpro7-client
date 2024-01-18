import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EBIMenu from '.';

const renderer = new ShallowRenderer();

describe('<EBIMenu />', () => {
  test('should render', () => {
    renderer.render(<EBIMenu />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
