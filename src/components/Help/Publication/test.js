import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { PrintedPublication } from '.';

const renderer = new ShallowRenderer();

describe('<Publication />', () => {
  test('should render', () => {
    renderer.render(<PrintedPublication />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
