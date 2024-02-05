import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Literature from '../src/components/Entry/Literature';

import Provider from './Provider';
import configureStore from './configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/References',
  component: Literature,
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
} satisfies Meta<typeof Literature>;

export default meta;
type LiteratureStory = StoryObj<typeof meta>;

const citation: Record<string, Array<[string, Reference]>> = {
  extra: [
    [
      'PUB00019074',
      {
        DOI_URL:
          'http://ukpmc.ac.uk/picrender.cgi?tool=EBI&pubmedid=11790261&action=stream&blobtype=pdf',
        ISBN: null,
        ISO_journal: 'Genome Biol.',
        PMID: 11790261,
        URL: null,
        authors: ['Harmar AJ.'],
        issue: '12',
        medline_journal: 'Genome Biol',
        raw_pages: 'REVIEWS3013',
        title: 'Family-B G-protein-coupled receptors.',
        volume: '2',
        year: 2001,
      },
    ],
  ],
  included: [],
};

export const Base: LiteratureStory = {
  args: {
    extra: citation.extra,
    included: citation.included,
  },
};
