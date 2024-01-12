import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EntitiesMenu from '.';

const renderer = new ShallowRenderer();

describe('<EntitiesMenu />', () => {
  test('should render', () => {
    renderer.render(<EntitiesMenu />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
