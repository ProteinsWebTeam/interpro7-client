// @flow
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
            protein: {
              accession: 'P00735',
              chain: 'A',
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
              entry_protein_locations: [
                {
                  fragments: [
                    { 'dc-status': 'CONTINUOUS', start: 45, end: 106 },
                  ],
                },
              ],
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
                name:
                  'THE X-RAY CRYSTAL STRUCTURE OF PPACK-MEIZOTHROMBIN DESF1: KRINGLE/THROMBIN AND CARBOHYDRATE/KRINGLE/THROMBIN INTERACTIONS AND LOCATION OF THE LINKER CHAIN',
                short: null,
              },
              release_date: '1998-06-17T00:00:00Z',
              resolution: 3.2,
              source_database: 'pdb',
            },
          },
        ]}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
