import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Provider from './Provider';
import configureStore from './configureStore';

const store = configureStore({ pathname: '/entry/interpro/ipr999999' });

import Description from 'components/Description';
import Literature from 'components/Entry/Literature';

const meta = {
  title: 'Basic UI/Description',
  component: Description,
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
} satisfies Meta<typeof Description>;

export default meta;
type DescriptionStory = StoryObj<typeof meta>;

const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

const descriptionWithCitations = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites [[cite:PUB1]]. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();
const citations: Array<[string, Reference]> = [
  [
    'PUB1',
    {
      PMID: 1,
      ISBN: null,
      volume: '260',
      issue: '9',
      year: 1985,
      title: 'The title',
      URL: null,
      raw_pages: '5328-41',
      ISO_journal: 'The Journal',
      authors: ['Me', 'My friends'],
      DOI_URL: 'http://www.lmgtfy.com',
    },
  ],
];

export const Base: DescriptionStory = {
  args: {
    textBlocks: [description],
  },
};
export const WithReferences: DescriptionStory = {
  args: {
    textBlocks: [descriptionWithCitations],
    literature: citations,
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <hr />
        <Literature included={citations} />
      </>
    ),
  ],
};
