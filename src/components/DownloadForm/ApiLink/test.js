// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ApiLink from '.';

const renderer = new ShallowRenderer();

describe('<ApiLink />', () => {
  test('should render', () => {
    renderer.render(<ApiLink url={'url'} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
