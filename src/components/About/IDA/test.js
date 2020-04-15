// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import AboutIDA from '.';

const renderer = new ShallowRenderer();

describe('<AboutIDA />', () => {
  test('should render with data', () => {
    renderer.render(<AboutIDA />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
