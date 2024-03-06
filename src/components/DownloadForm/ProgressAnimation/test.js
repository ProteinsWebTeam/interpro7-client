import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ProgressAnimation from '.';

const renderer = new ShallowRenderer();

describe('<ProgressAnimation />', () => {
  test('should render', () => {
    renderer.render(
      <ProgressAnimation download={{ progress: 1, successful: true }} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
