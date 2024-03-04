import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { EntryMenuLink } from '.';
import EntryMenuLinkWithoutData from './EntryMenuLinkWithoutData';

const renderer = new ShallowRenderer();

describe('<EntryMenuLinkWithoutData />', () => {
  test('should render', () => {
    renderer.render(
      <EntryMenuLinkWithoutData
        name={'Structures'}
        value={41369}
        to={() => {}}
        loading={false}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

describe('<EntryMenuLink />', () => {
  test('should render', () => {
    renderer.render(
      <EntryMenuLink
        to={() => {}}
        name={'Proteins'}
        counter={'proteins'}
        data={{
          loading: false,
          payload: {
            metadata: {
              accession: '9606',
              counters: {
                dbEntries: {
                  cathgene3d: 2233,
                  cdd: 5912,
                  hamap: 389,
                  interpro: 16561,
                  mobidblt: 1,
                  panther: 24795,
                  pfam: 6622,
                  pirsf: 960,
                  prints: 1488,
                  profile: 869,
                  prosite: 884,
                  sfld: 64,
                  smart: 1024,
                  ssf: 1129,
                  tigrfams: 595,
                },
                domain_architectures: 13877,
                entries: 63526,
                proteins: 171145,
                proteomes: 1,
                sets: 5750,
                structures: 41369,
              },
              lineage:
                ' 1 131567 2759 33154 33208 6072 33213 33511 7711 89593 7742 7776 117570 117571 8287 1338369 32523 32524 40674 32525 9347 1437010 314146 9443 376913 314293 9526 314295 9604 207598 9605 9606 ',
              name: {
                name: 'Homo sapiens',
                short: 'Homo sapiens (Human)',
              },
              parent: '9605',
              rank: 'species',
              source_database: 'uniprot',
            },
          },
        }}
        mainKey={'taxonomy'}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
