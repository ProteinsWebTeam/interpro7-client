// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Faqs from '.';

const renderer = new ShallowRenderer();

describe('<Faqs />', () => {
  test('should render', () => {
    renderer.render(<Faqs />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
