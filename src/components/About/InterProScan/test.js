// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { InterProScan } from '.';

const renderer = new ShallowRenderer();

describe('<InterProScan />', () => {
  test('should render without data', () => {
    renderer.render(<InterProScan data={{ loading: true, payload: null }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
