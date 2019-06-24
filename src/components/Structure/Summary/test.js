// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { SummaryStructure } from '.';

const renderer = new ShallowRenderer();

describe('<SummaryStructure />', () => {
  test('should render', () => {
    renderer.render(
      <SummaryStructure
        data={{
          loading: false,
          payload: {
            metadata: {
              accession: '102m',
              chains: ['A'],
              counters: {
                dbEntries: {
                  cathgene3d: 1,
                  interpro: 4,
                  panther: 1,
                  pfam: 1,
                  prints: 1,
                  profile: 1,
                  ssf: 1,
                },
                domain_architectures: 1,
                entries: 10,
                proteins: 1,
                proteomes: 1,
                sets: 1,
                taxa: 1,
              },
              experiment_type: 'x-ray',
              literature: {},
              name: {
                name: 'SPERM WHALE MYOGLOBIN H64A AQUOMET AT PH 9.0',
              },
              release_date: '1998-04-08T00:00:00Z',
              resolution: 1.84,
              source_database: 'pdb',
            },
          },
        }}
        dataMatches={{
          loading: false,
          payload: {
            count: 1,
            results: [
              {
                metadata: {
                  accession: 'G3DSA:1.10.490.10',
                  go_terms: null,
                  integrated: 'IPR012292',
                  member_databases: null,
                  name: 'Globins',
                  source_database: 'cathgene3d',
                  type: 'homologous_superfamily',
                },
                structures: [
                  {
                    accession: '102m',
                    chain: 'A',
                  },
                ],
              },
            ],
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
