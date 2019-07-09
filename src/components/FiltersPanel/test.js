// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { FilterPanel, FiltersPanel } from '.';

const renderer = new ShallowRenderer();

describe('<FiltersPanel />', () => {
  test('should render', () => {
    renderer.render(
      <FiltersPanel
        customLocation={{
          description: {
            entry: { db: 'InterPro' },
            main: { key: 'entry' },
          },
          hash: 'table',
          search: {},
        }}
        goToCustomLocation={() => {}}
      >
        <FilterPanel label={'InterPro Type'} />
      </FiltersPanel>,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
