import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Help from '.';

const renderer = new ShallowRenderer();

describe('<Help />', () => {
  test('should render', () => {
    renderer.render(<Help />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
