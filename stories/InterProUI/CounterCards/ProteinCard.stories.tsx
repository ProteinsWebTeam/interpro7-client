import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProteinCard from 'components/Protein/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Protein Card',
  component: ProteinCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof ProteinCard>;

export default meta;
type ProteinCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The protein',
    source_database: 'UniProt',
    accession: 'P12345',
    source_organism: {
      fullName: 'Canis lupus familiaris (dog)',
      taxId: 9615
    },
  } as unknown as ProteinMetadata,
  extra_fields: {
    counters: {
      entries: 1,
      structures: 1,
    } as MetadataCounters,
  },
};
export const Base: ProteinCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
  },
};
