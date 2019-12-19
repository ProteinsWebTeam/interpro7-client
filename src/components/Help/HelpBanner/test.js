// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { HelpBanner } from '.';

const renderer = new ShallowRenderer();

describe('<HelpBanner />', () => {
  test('should render', () => {
    renderer.render(<HelpBanner />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
