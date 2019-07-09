// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Funding from '.';

const renderer = new ShallowRenderer();

describe('<Funding />', () => {
  test('should render', () => {
    renderer.render(<Funding />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
