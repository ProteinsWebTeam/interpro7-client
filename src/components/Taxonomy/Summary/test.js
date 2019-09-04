import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SummaryTaxonomy } from '.';

const renderer = new ShallowRenderer();

describe('<SummaryTaxonomy />', () => {
  test('should render', () => {
    renderer.render(
      <SummaryTaxonomy
        dataNames={{
          payload: {
            metadata: {
              accession: '131567',
              children: ['2', '2157', '2759'],
              lineage: ' 1 131567 ',
              name: {
                name: 'cellular organisms',
                short: 'cellular organisms',
              },
              parent: '1',
              rank: 'no rank',
              source_database: 'uniprot',
            },
            names: {
              1: {
                name: 'root',
                short: 'root',
              },
              2: {
                name: 'Bacteria',
                short: 'Bacteria (eubacteria)',
              },
              2157: {
                name: 'Archaea',
                short: 'Archaea',
              },
              2759: {
                name: 'Eukaryota',
                short: 'Eukaryota (eucaryotes)',
              },
              131567: {
                name: 'cellular organisms',
                short: 'cellular organisms',
              },
            },
          },
          loading: false,
        }}
        goToCustomLocation={() => {}}
        customLocation={{
          description: {
            main: {
              key: 'taxonomy',
            },
            taxonomy: {
              accession: '131567',
              db: 'uniprot',
            },
          },
          search: {},
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
