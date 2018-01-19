// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Overlay } from '.';

const renderer = new ShallowRenderer();

describe('<Overlay />', () => {
  test('should render as visible', () => {
    renderer.render(<Overlay visible closeEverything={() => {}} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('should render as invisible', () => {
    renderer.render(<Overlay visible={false} closeEverything={() => {}} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
