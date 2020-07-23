// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Webinar from '.';

const renderer = new ShallowRenderer();

describe('<Webinar />', () => {
  test('should render', () => {
    renderer.render(<Webinar />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
