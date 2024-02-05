import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProteinViewer } from 'components/ProteinViewer';

import Provider from '../Provider';
import configureStore from '../configureStore';

import domains from './domain.json';
import secondaryStructure from './secondaryStructure.json';

const store = configureStore();

const meta = {
  title: 'InterPro UI/ProteinViewer',
  component: ProteinViewer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <div style={{ width: '100dvw' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof ProteinViewer>;

export default meta;
type ProteinViewerStory = StoryObj<typeof meta>;

const sequence =
  'MDFFVRLARETGDRKREFLELGRKAGRFPAASTSNGEISIWCSNDYLGMGQHPDVLDAMKRSVDEYGGGSGGSRNTGGTNHFHVALEREPAEPHGKEDAVLFTSGYSANEGSLSVLAGA';

export const JustSequence: ProteinViewerStory = {
  args: {
    protein: { accession: 'test', sequence, length: sequence.length },
    data: [],
    title: 'Viewer for SB',
    loading: false,
  },
};

export const SequenceAndDomains = () => {
  return (
    <ProteinViewer
      protein={{ accession: 'test', sequence, length: sequence.length }}
      data={[['Domains', domains]]}
      title="Domains"
      loading={false}
    />
  );
};

export const WithSecondaryStructure = () => {
  return (
    <ProteinViewer
      protein={{ accession: 'test', sequence, length: sequence.length }}
      data={[
        ['Secondary Structure', secondaryStructure],
        ['Domains', domains],
      ]}
      title="Domains and Secondary Structure"
      loading={false}
    />
  );
};
