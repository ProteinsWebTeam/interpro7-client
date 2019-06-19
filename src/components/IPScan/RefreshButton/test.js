// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { RefreshButton } from '.';

const renderer = new ShallowRenderer();
// const myHeaders = new Headers({'client-cache': true});

describe('<RefreshButton />', () => {
  test('should render', () => {
    renderer.render(<RefreshButton updateJobStatus={() => {}} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
