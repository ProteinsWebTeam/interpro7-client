// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Publication from '.';

const renderer = new ShallowRenderer();

describe('<Publication />', () => {
  test('should render', () => {
    renderer.render(<Publication />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
