// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { LoadingBar } from '.';

const renderer = new ShallowRenderer();

describe('<LoadingBar />', () => {
  test('should render with value 0', () => {
    renderer.render(<LoadingBar progress={0} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render with value 0.5', () => {
    renderer.render(<LoadingBar progress={0.5} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render with value 1', () => {
    renderer.render(<LoadingBar progress={1} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
