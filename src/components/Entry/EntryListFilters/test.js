import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { EntryListFilter } from '.';

const renderer = new ShallowRenderer();

describe('<EntryListFilter />', () => {
  test('should render', () => {
    renderer.render(<EntryListFilter mainDB={'InterPro'} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
