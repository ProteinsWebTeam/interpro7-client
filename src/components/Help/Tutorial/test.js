// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Tutorial from '.';

const renderer = new ShallowRenderer();

describe('<Tutorial />', () => {
  test('should render', () => {
    renderer.render(<Tutorial />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
