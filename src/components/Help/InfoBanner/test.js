// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { InfoBanner } from '.';

const renderer = new ShallowRenderer();

describe('<InfoBanner />', () => {
  test('should render', () => {
    renderer.render(<InfoBanner />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
