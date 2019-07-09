// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import LazyImage from '.';

const renderer = new ShallowRenderer();

describe('<LazyImage />', () => {
  test('should render', () => {
    renderer.render(<LazyImage alt={'Elixir logo'} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
