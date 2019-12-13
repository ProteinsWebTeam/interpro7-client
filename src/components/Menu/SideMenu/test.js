// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SideMenu } from '.';

const renderer = new ShallowRenderer();

describe('<SideMenu />', () => {
  test('should be hidden', () => {
    renderer.render(
      <SideMenu
        visible={false}
        closeSideNav={() => {}}
        showConnectionStatusToast={true}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render', () => {
    renderer.render(
      <SideMenu
        visible={true}
        closeSideNav={() => {}}
        showConnectionStatusToast={true}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
