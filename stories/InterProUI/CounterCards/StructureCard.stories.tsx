import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import StructureCard from 'components/Structure/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Structure Card',
  component: StructureCard,
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
} satisfies Meta<typeof StructureCard>;

export default meta;
type StructureCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The Structure',
    source_database: 'PDB',
    accession: '1cuk',
  } as unknown as StructureMetadata,
  extra_fields: {
    counters: {
      entries: Math.round(Math.random() * 10000),
      proteins: Math.round(Math.random() * 10000),
      taxa: Math.round(Math.random() * 10000),
    } as MetadataCounters,
  },
};
export const Base: StructureCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
  },
};
