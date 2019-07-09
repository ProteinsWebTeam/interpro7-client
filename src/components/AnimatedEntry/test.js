// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { AnimatedEntry } from '.';

const renderer = new ShallowRenderer();

describe('<AnimatedEntry />', () => {
  test('should render', () => {
    renderer.render(
      <AnimatedEntry element={'div'} lowGraphics={false} dispatch={() => {}} />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
