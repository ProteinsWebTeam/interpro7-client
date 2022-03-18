// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ByLatestEntries } from '.';

const renderer = new ShallowRenderer();

describe('<ByEntriesFeatured />', () => {
  test('By Entries Featured', () => {
    renderer.render(
      <ByLatestEntries
        data={{
          payload: {
            results: [
              {
                extra_fields: {
                  counters: {
                    domain_architectures: 0,
                    proteins: 504,
                    proteomes: 141,
                    sets: 0,
                    structures: 0,
                    taxa: 220,
                  },
                },
                metadata: {
                  accession: 'IPR026652',
                  member_databases: {
                    panther: {
                      PTHR46657: 'FAMILY NOT NAMED',
                    },
                  },
                  name: 'Centrosomal protein of 128kDa',
                  source_database: 'interpro',
                  type: 'family',
                },
              },
            ],
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
