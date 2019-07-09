// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ProteinListFilters } from '.';

const renderer = new ShallowRenderer();

describe('<ProteinListFilters />', () => {
  test('should render', () => {
    renderer.render(<ProteinListFilters hasEntryFilter={true} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
