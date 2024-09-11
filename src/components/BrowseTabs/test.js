import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { BrowseTabsWithoutData } from '.';

const renderer = new ShallowRenderer();

describe('<BrowseTabsWithoutData />', () => {
  test('should render', () => {
    renderer.render(<BrowseTabsWithoutData metadata={{ metadata: null }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
