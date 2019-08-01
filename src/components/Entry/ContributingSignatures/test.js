// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { ContributingSignatures } from '.';

const renderer = new ShallowRenderer();

describe('<ContributingSignatures />', () => {
  test('should render', () => {
    renderer.render(
      <ContributingSignatures
        contr={{
          pfam: { PF00051: 'Kringle domain' },
        }}
        data={{
          loading: false,
          payload: {
            databases: {
              pfam: {
                canonical: 'pfam',
                description:
                  'Pfam is a large collection of multiple sequence alignments and hidden Markov models covering many common protein domains. Pfam is based at EMBL-EBI, Hinxton, UK.',
                name: 'Pfam',
                releaseDate: '2018-10-02T00:00:00Z',
                type: 'entry',
                version: '32.0',
              },
            },
          },
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
