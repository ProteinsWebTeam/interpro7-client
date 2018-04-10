// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Pages } from '.';

const renderer = new ShallowRenderer();

describe('<Pages />', () => {
  test('should render', () => {
    renderer.render(<Pages stuck top={40} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
