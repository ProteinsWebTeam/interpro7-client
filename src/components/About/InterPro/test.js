// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import AboutInterPro from '.';

const renderer = new ShallowRenderer();

describe('<AboutInterPro />', () => {
  test('should render', () => {
    renderer.render(<AboutInterPro />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
