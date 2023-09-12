import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import StructureOnProtein from '.';

const renderer = new ShallowRenderer();

describe('<StructureOnProtein />', () => {
  test('should render', () => {
    renderer.render(
      <StructureOnProtein
        matches={[
          {
            chain: 'A',
            structure_protein_locations: [
              {
                fragments: [
                  {
                    start: 1,
                    end: 203,
                    protein_start: 1,
                    protein_end: 203,
                  },
                ],
              },
            ],
          },
        ]}
        match={{
          protein: {
            accession: 'P00735',
            counters: {
              extra_fields: {
                counters: {
                  entries: 43,
                  proteome: 1,
                  sets: 3,
                  structures: 1,
                  taxonomy: 1,
                },
              },
            },
            length: 625,
            name: 'Prothrombin',
            protein: 'p00735',
            protein_length: 625,
            source_database: 'reviewed',
          },
          structure: {
            accession: '1a0h',
            chain: ['A', 'B', 'D', 'E'],
            experiment_type: 'x-ray',
            name: {
              name: 'THE X-RAY CRYSTAL STRUCTURE OF PPACK-MEIZOTHROMBIN DESF1: KRINGLE/THROMBIN AND CARBOHYDRATE/KRINGLE/THROMBIN INTERACTIONS AND LOCATION OF THE LINKER CHAIN',
              short: null,
            },
            release_date: '1998-06-17T00:00:00Z',
            resolution: 3.2,
            source_database: 'pdb',
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
