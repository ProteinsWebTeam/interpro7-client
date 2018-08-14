// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Documentation from '.';

const renderer = new ShallowRenderer();

describe('<Documentation />', () => {
  test('should render', () => {
    renderer.render(<Documentation />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
