import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EntriesOnStructure from '.';

const renderer = new ShallowRenderer();

describe('<EntriesOnStructure />', () => {
  test('should render', () => {
    renderer.render(
      <EntriesOnStructure
        matches={[
          {
            chain: 'A',
            entry_structure_locations: [
              {
                fragments: [
                  {
                    'dc-status': 'CONTINUOUS',
                    end: 188,
                    start: 105,
                  },
                ],
              },
              {
                fragments: [
                  {
                    'dc-status': 'CONTINUOUS',
                    end: 293,
                    start: 211,
                  },
                ],
              },
            ],
          },
        ]}
        match={{
          entry: {
            accession: 'IPR000001',
            counters: {
              domain_architectures: 12,
              proteins: 19,
              proteomes: 4,
              sets: 0,
              structures: 698,
              taxa: 5,
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
          },
          structure: {
            accession: '1a4w',
            chain: 'H',
            experiment_type: 'x-ray',
            name: "CRYSTAL STRUCTURES OF THROMBIN WITH THIAZOLE-CONTAINING INHIBITORS: PROBES OF THE S1' BINDING SITE",
            protein: 'p00734',
            protein_length: 622,
            resolution: 1.8,
            source_database: 'pdb',
            structure_protein_locations: [],
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
