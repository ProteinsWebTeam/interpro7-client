// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SummaryEntry } from '.';

const renderer = new ShallowRenderer();

describe('<SummaryEntry />', () => {
  test('should render', () => {
    renderer.render(
      <SummaryEntry
        data={{
          metadata: {
            accession: 'IPR000001',
            counters: {
              domain_architectures: 511,
              matches: 44375,
              proteins: 6786,
              proteomes: 343,
              sets: 0,
              structures: 698,
              taxa: 675,
            },
            cross_references: {},
            description: ['<p>Kringle</p>'],
            overlaps_with: [
              {
                accession: 'IPR013806',
                name: 'Kringle-like fold',
                type: 'homologous_superfamily',
              },
              {
                accession: 'IPR038178',
                name: 'Kringle superfamily',
                type: 'homologous_superfamily',
              },
            ],
            source_database: 'interpro',
            type: 'domain',
            name: {
              name: 'Kringle',
              short: 'Kringle',
            },
            go_terms: {},
            literature: {},
            wikipedia: '',
          },
        }}
        dbInfo={{}}
        loading={false}
        api={{}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
