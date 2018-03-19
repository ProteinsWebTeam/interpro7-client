// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { EMBLDropdown } from '.';

const renderer = new ShallowRenderer();

describe('<EMBLDropdown />', () => {
  test('should render as visible', () => {
    renderer.render(<EMBLDropdown visible />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render as invisible', () => {
    renderer.render(<EMBLDropdown />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
