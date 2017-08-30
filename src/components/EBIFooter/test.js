// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EBIFooter from '.';

const renderer = new ShallowRenderer();

describe('<EBIFooter />', () => {
  test('should render', () => {
    renderer.render(<EBIFooter />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
