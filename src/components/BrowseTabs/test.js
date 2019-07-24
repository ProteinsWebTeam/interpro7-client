// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { BrowseTabsWithoutData } from '.';

const renderer = new ShallowRenderer();

describe('<BrowseTabsWithoutData />', () => {
  test('should render', () => {
    renderer.render(
      <BrowseTabsWithoutData
        data={{
          loading: false,
          payload: null,
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
