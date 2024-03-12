import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import SetCard from 'components/Set/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Set Card',
  component: SetCard,
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
} satisfies Meta<typeof SetCard>;

export default meta;
type SetCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The Clan',
    source_database: 'pfam',
    accession: 'CL0000',
  } as unknown as SetMetadata,
  extra_fields: {
    counters: {
      entries: Math.round(Math.random() * 10000),
      proteins: Math.round(Math.random() * 10000),
      taxa: Math.round(Math.random() * 10000),
      structures: Math.round(Math.random() * 10000),
      proteomes: Math.round(Math.random() * 10000),
    } as MetadataCounters,
  },
};
export const Base: SetCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
  },
};
