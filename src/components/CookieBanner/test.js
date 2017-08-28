// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CookieBanner from '.';

const renderer = new ShallowRenderer();

describe('<CookieBanner />', () => {
  test('should render', () => {
    renderer.render(<CookieBanner />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
