import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import EntriesOnProtein from '.';

const renderer = new ShallowRenderer();

describe('<EntriesOnProtein />', () => {
  test('should render', () => {
    renderer.render(
      <EntriesOnProtein
        matches={[
          {
            entry_protein_locations: [
              {
                fragments: [
                  {
                    end: 380,
                    start: 300,
                  },
                ],
              },
            ],
          },
        ]}
        match={{
          entry: {
            accession: 'IPR000001',
            name: {
              name: 'Kringle',
              short: 'Kringle',
            },
            source_database: 'interpro',
            type: 'domain',
          },
          protein: {
            accession: 'A0A016WA74',
            name: 'Uncharacterized protein',
            length: 882,
            protein_length: 882,
            source_database: 'unreviewed',
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
