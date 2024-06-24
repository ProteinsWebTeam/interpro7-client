import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import StructureListFilters from '.';

const renderer = new ShallowRenderer();

describe('<StructureListFilters />', () => {
  test('should render', () => {
    renderer.render(<StructureListFilters />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
