import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import TaxonomyCard from 'components/Taxonomy/Card';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Counter Cards/Taxonomy Card',
  component: TaxonomyCard,
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
} satisfies Meta<typeof TaxonomyCard>;

export default meta;
type TaxonomyCardStory = StoryObj<typeof meta>;

const data = {
  metadata: {
    name: 'The Taxon',
    source_database: 'uniprot',
    accession: '765',
  } as unknown as TaxonomyMetadata,
  extra_fields: {
    counters: {
      entries: Math.round(Math.random() * 10000),
      proteins: Math.round(Math.random() * 10000),
      structures: Math.round(Math.random() * 10000),
      proteomes: Math.round(Math.random() * 10000),
    } as MetadataCounters,
    lineage: ' 1 131567 2 1224 28211 356 335928 6 7 ',
  },
};
export const Base: TaxonomyCardStory = {
  args: {
    data: data,
    search: '',
    entryDB: 'interpro',
  },
};
