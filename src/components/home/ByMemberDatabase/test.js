// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ByMemberDatabase } from '.';

const renderer = new ShallowRenderer();

describe('<ByMemberDatabase />', () => {
  test('Member Databases types', () => {
    renderer.render(
      <ByMemberDatabase
        data={{
          payload: {
            entries: {
              all: 215965,
              integrated: 49513,
              interpro: 36651,
              member_databases: {
                cathgene3d: 6035,
                cdd: 12779,
                hamap: 2274,
                mobidblt: 1,
                panther: 122736,
                pfam: 17860,
                pirsf: 3292,
                prints: 2106,
                profile: 1232,
                prosite: 1310,
                sfld: 303,
                smart: 1312,
                ssf: 2019,
                tigrfams: 4444,
              },
              unintegrated: 128272,
            },
          },
        }}
        dataMeta={{
          payload: {
            databases: {
              pfam: {
                canonical: 'pfam',
                name: 'Pfam',
                releaseDate: '2018-10-02T00:00:00Z',
                type: 'entry',
                version: '32.0',
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
            sources: {
              elasticsearch: {
                server: 'interpro',
                status: 'OK',
              },
              mysql: {
                server: 'rel',
                status: 'OK',
              },
            },
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
