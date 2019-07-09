import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SearchResults } from '.';

const renderer = new ShallowRenderer();

describe('<SearchResults />', () => {
  test('should render', () => {
    renderer.render(
      <SearchResults
        data={{
          loading: false,
          payload: {
            entries: [
              {
                id: 'IPR020422',
                source: 'interpro',
                fields: {
                  description: ['Description'],
                  name: ['Dual specificity protein phosphatase domain'],
                  source_database: [],
                },
              },
            ],
            facets: [],
          },
        }}
        isStale={false}
        searchValue={'IPR020422'}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
