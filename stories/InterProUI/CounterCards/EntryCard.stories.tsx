import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EntryCard from 'components/Entry/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Entry Card',
  component: EntryCard,
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
} satisfies Meta<typeof EntryCard>;

export default meta;
type EntryCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The entry',
    type: 'domain',
    source_database: 'InterPro',
    accession: 'IPR000000',
    member_databases: {
      pfam: {
        PF00000: {},
        PF99999: {},
      },
      cdd: {
        CD00000: {},
      },
    },
  } as unknown as EntryMetadata,
  extra_fields: {
    counters: {
      proteins: 1,
      domain_architectures: 1,
      taxa: 1,
      structures: 1,
      sets: 1,
    } as MetadataCounters,
    description: [{ text: 'The cool description', llm: false, checked: false }],
    literature: {},
  },
};
export const Base: EntryCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
    showDescription: true,
  },
};
