import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DomainArchitecturesWithData } from '.';

const renderer = new ShallowRenderer();

describe('<DomainArchitecturesWithData />', () => {
  test('should render', () => {
    renderer.render(
      <DomainArchitecturesWithData
        data={{
          loading: false,
          payload: {
            count: 511,
            results: [
              {
                ida:
                  'PF00594:IPR000294-PF00051:IPR000001-PF00051:IPR000001-PF09396:IPR018992-PF00089:IPR001254',
                ida_id: 'f4536d89e1b17ef8000602879b888026d22d1348',
                unique_proteins: 301,
              },
            ],
          },
        }}
        dataDB={{
          loading: false,
          payload: {
            databases: {
              interpro: {
                canonical: 'interpro',
                name: 'InterPro',
                releaseDate: '2019-07-04T00:00:00Z',
                type: 'entry',
                version: '75.0',
              },
            },
            endpoints: [
              'entry',
              'protein',
              'structure',
              'taxonomy',
              'proteome',
              'set',
              'utils',
            ],
            sources: { elasticsearch: {}, mysql: {} },
          },
        }}
        mainAccession={'IPR000001'}
        search={{}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
