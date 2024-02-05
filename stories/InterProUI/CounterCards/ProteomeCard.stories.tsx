import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ProteomeCard from 'components/Proteome/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Proteome Card',
  component: ProteomeCard,
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
} satisfies Meta<typeof ProteomeCard>;

export default meta;
type ProteomeCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The Proteome',
    source_database: 'uniprot',
    accession: 'UP932932923',
  } as unknown as ProteomeMetadata,
  extra_fields: {
    counters: {
      entries: Math.round(Math.random() * 10000),
      proteins: Math.round(Math.random() * 10000),
      structures: Math.round(Math.random() * 10000),
    } as MetadataCounters,
  },
};
export const Base: ProteomeCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
  },
};
