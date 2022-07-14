// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SearchResults } from '.';
import { ExactMatch } from './ExactMatch';

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
        query={{}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<ExactMatch />', () => {
  test('search with exact protein accession', () => {
    renderer.render(
      <ExactMatch
        data={{
          loading: false,
          payload: {
            endpoint: 'protein',
            source_database: 'reviewed',
            accession: 'P99999',
          },
        }}
        dataNumber={{
          loading: false,
          payload: null,
        }}
        searchValue="P99999"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('search with  number 1 ', () => {
    renderer.render(
      <ExactMatch
        data={{
          loading: false,
          payload: {
            endpoint: 'entry',
            source_database: 'interpro',
            accession: 'IPR000001',
          },
        }}
        dataNumber={{
          loading: false,
          payload: {
            endpoint: 'taxonomy',
            source_database: 'uniprot',
            accession: '1',
          },
        }}
        searchValue="1"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  test('search with gene CYC', () => {
    renderer.render(
      <ExactMatch
        data={{
          loading: false,
          payload: {
            endpoint: 'protein',
            source_database: 'uniprot',
            proteins: [
              {
                accession: 'O61734',
                organism: 'Drosophila melanogaster',
                tax_id: '7227',
              },
              { accession: 'Q6IQM2', organism: 'Danio rerio', tax_id: '7955' },
            ],
          },
        }}
        dataNumber={{
          loading: false,
          payload: null,
        }}
        searchValue="CYC"
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
