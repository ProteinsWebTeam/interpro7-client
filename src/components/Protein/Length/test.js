// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Length from '.';

const renderer = new ShallowRenderer();

describe('<Length />', () => {
  test('should render', () => {
    renderer.render(<Length metadata={{ length: 100, fragment: 'N' }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Length metadata={{ length: 100, fragment: 'Y' }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    renderer.render(<Length metadata={{ length: 100 }} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
