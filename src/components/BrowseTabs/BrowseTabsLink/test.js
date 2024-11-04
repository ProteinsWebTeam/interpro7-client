import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import BrowseTabsLink from '.';

const renderer = new ShallowRenderer();

describe('<BrowseTabsLink />', () => {
  test('should render', () => {
    renderer.render(
      <BrowseTabsLink
        name={'Entry'}
        to={() => {}}
        data={{
          loading: false,
          payload: null,
        }}
        isFirstLevel={true}
        isSignature={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
