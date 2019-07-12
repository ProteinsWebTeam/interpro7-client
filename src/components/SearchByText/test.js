// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SearchByText } from '.';

const renderer = new ShallowRenderer();

describe('<SearchByText />', () => {
  test('should render', () => {
    renderer.render(<SearchByText main={'search'} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
