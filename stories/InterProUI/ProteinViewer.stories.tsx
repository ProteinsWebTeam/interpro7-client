import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ProteinViewer } from 'components/ProteinViewer';

import Provider from '../Provider';
import configureStore from '../configureStore';

const store = configureStore();

// TODO: There is a problem when loading this stories twice

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

const domains = [
  {
    accession: 'IPR999999',
    protein_length: sequence.length,
    source_database: 'interpro',
    entry_protein_locations: [
      {
        fragments: [{ start: 41, end: 95 }],
      },
    ],
    name: 'Aminotransferase, class I/classII',
    type: 'domain',
    integrated: null,
    children: [
      {
        accession: 'PF99999',
        protein_length: sequence.length,
        source_database: 'pfam',
        entry_protein_locations: [
          {
            fragments: [{ start: 41, end: 95, 'dc-status': 'CONTINUOUS' }],
          },
        ],
        name: 'Aminotransferase class I and II',
        type: 'domain',
        integrated: 'IPR999999',
      },
    ],
  },
];
const secondaryStructure = [
  {
    locations: [
      {
        fragments: [{ shape: 'helix', start: 4, end: 19, fill: 'transparent' }],
      },
      {
        fragments: [{ shape: 'strand', start: 34, end: 79, fill: 'red' }],
      },
    ],
    type: 'secondary_structure',
    accession: 'Chain A',
    source_database: 'PDB',
    chain: 'A',
  },
];

export const JustSequence: ProteinViewerStory = {
  args: {
    protein: { accession: 'test', sequence, length: sequence.length },
    data: [],
    title: 'Viewer for SB',
    loading: false,
  },
};
export const SequenceAndDomains: ProteinViewerStory = {
  args: {
    protein: { accession: 'test', sequence, length: sequence.length },
    data: [['Domains', domains]],
    title: 'Viewer for SB with Domains',
    loading: false,
  },
};
export const WithSecondaryStructure: ProteinViewerStory = {
  args: {
    protein: { accession: 'test', sequence, length: sequence.length },
    data: [
      ['Secondary Structure', secondaryStructure],
      ['Domains', domains],
    ],
    title: 'Viewer for SB with Domains',
    loading: false,
  },
};
