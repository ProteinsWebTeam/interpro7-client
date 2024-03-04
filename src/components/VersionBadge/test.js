import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { VersionBadge } from '.';

const renderer = new ShallowRenderer();

describe('<VersionBadge />', () => {
  test('should render', () => {
    renderer.render(<VersionBadge version={'75.0'} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
