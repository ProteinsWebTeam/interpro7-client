import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EntriesOnStructure from '.';

const renderer = new ShallowRenderer();

describe('<EntriesOnStructure />', () => {
  test('should render', () => {
    renderer.render(
      <EntriesOnStructure
        entries={[
          {
            accession: 'IPR038178',
            chain: 'A',
            entry_structure_locations: [
              {
                fragments: [{ 'dc-status': 'CONTINUOUS', start: 44, end: 199 }],
              },
            ],
            experiment_type: 'x-ray',
            name: 'Kringle superfamily',
            protein: 'p00735',
            structure_protein_locations: [
              { fragments: [{ start: 208, end: 366 }] },
            ],
            protein_length: 625,
            resolution: 3.2,
            source_database: 'interpro',
            type: 'homologous_superfamily',
          },
        ]}
        unintegrated={[]}
        secondaryStructures={[]}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
