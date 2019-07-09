// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ByEntriesFeatured } from '.';

const renderer = new ShallowRenderer();

describe('<ByEntriesFeatured />', () => {
  test('By Entries Featured', () => {
    renderer.render(
      <ByEntriesFeatured
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
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
