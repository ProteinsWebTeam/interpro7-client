// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ViewerOnDemand } from '.';

const renderer = new ShallowRenderer();

describe('<ViewerOnDemand />', () => {
  test('should render', () => {
    renderer.render(
      <ViewerOnDemand
        id={'102m'}
        matches={[
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
        ]}
        userActivatedVisible={false}
        changeSettingsRaw={() => {}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
