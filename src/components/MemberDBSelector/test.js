// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { _MemberDBSelector as MemberDBSelector } from '.';

const renderer = new ShallowRenderer();

describe('<MemberDBSelector />', () => {
  test('should render', () => {
    renderer.render(
      <MemberDBSelector
        contentType={'entry'}
        lowGraphics={false}
        goToCustomLocation={() => {}}
        customLocation={{
          description: {
            entry: {
              db: 'InterPro',
            },
            main: {
              key: 'entry',
            },
          },
          search: {},
        }}
        dataDB={{
          loading: false,
          payload: {
            databases: {
              interpro: {
                canonical: 'interpro',
                name: 'InterPro',
                releaseDate: '2019-05-09T00:00:00Z',
                type: 'entry',
                version: '74.0',
              },
              cdd: {
                canonical: 'cdd',
                name: 'CDD',
                releaseDate: '2017-03-28T00:00:00Z',
                type: 'entry',
                version: '3.16',
              },
            },
          },
        }}
        dataDBCount={{
          loading: false,
          payload: {
            entries: {
              all: 215965,
              integrated: 49513,
              interpro: 36651,
              unintegrated: 128272,
              member_databases: {
                cdd: 12779,
              },
            },
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
