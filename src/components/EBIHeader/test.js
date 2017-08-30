// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EBIHeader from '.';

const renderer = new ShallowRenderer();

describe('<EBIHeader />', () => {
  test('should render', () => {
    renderer.render(<EBIHeader />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
