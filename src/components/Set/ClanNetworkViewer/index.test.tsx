import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { ClanNetworkViewer } from '.';

const node = (accession: string) => ({
  accession,
  short_name: accession,
  name: accession,
  type: 'Domain',
  score: 100,
});

const makeMetadata = (nodeCount: number): SetMetadata =>
  ({
    accession: 'CL0001',
    id: 'CL0001',
    name: { name: 'Test clan' },
    description: '',
    source_database: 'pfam',
    authors: null,
    literature: [],
    wikipedia: [],
    relationships: {
      nodes: Array.from({ length: nodeCount }, (_, i) => node(`PF${i}`)),
      links: [],
    },
  }) as SetMetadata;

const noopGoToCustomLocation = jest.fn() as never;

describe('<ClanNetworkViewer />', () => {
  const renderer = createRenderer();

  test('renders nothing while loading', () => {
    renderer.render(
      <ClanNetworkViewer
        data={{ metadata: undefined as never }}
        loading
        goToCustomLocation={noopGoToCustomLocation}
      />,
    );
    expect(renderer.getRenderOutput()).toBeNull();
  });

  test('renders the network container directly for a small clan', () => {
    renderer.render(
      <ClanNetworkViewer
        data={{ metadata: makeMetadata(5) }}
        loading={false}
        goToCustomLocation={noopGoToCustomLocation}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('gates a large clan behind a "Visualise it" prompt', () => {
    renderer.render(
      <ClanNetworkViewer
        data={{ metadata: makeMetadata(150) }}
        loading={false}
        goToCustomLocation={noopGoToCustomLocation}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
