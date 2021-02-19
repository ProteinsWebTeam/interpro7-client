// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { List } from '.';

const renderer = new ShallowRenderer();

describe('<List />', () => {
  test('should render', () => {
    renderer.render(
      <List
        data={{
          loading: false,
          payload: {
            data: [
              {
                accession: 'E0W2I7',
                length: 1010,
                locations: [{ fragments: [{ start: 87, end: 179 }] }],
                metadata: {
                  anno_id: 581570,
                  confidence: '99',

                  resource: 'Gene3D',
                  type: 'PREDICTED_DOMAIN',
                },
                tooltipContent:
                  "Predicted domain from Genome3D resource 'Gene3D' based on UniProtKB E0W2I7/87-179 matching classification 1nl1A00",
              },
            ],
            interpro: {
              ipr_id: 'IPR000001',
              release_date: '2019-03-25T00:00:00',
              release_name: 'InterPro v73',
            },
            message:
              'Showing 1 to 20 of 1649 Genome3D annotations for InterPro entry IPR000001',
            pager: {
              current_page: 1,
              entries_per_page: 20,
              entry_from: 1,
              entry_to: 20,
              total_entries: 1649,
              total_pages: 83,
            },
          },
        }}
        customLocation={{
          description: {
            entry: {
              accession: 'IPR000001',
              db: 'InterPro',
              detail: 'genome3d',
            },
            main: {
              ket: 'entry',
            },
          },
        }}
        dataResource={{
          loading: false,
          payload: [],
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
