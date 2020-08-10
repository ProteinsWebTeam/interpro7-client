import React from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';

import Description, { DescriptionReadMore } from 'components/Description';
import Provider from './Provider';
import configureStore from './configuedStore.js';
import Literature from 'components/Entry/Literature';

const store = configureStore({ pathname: '/entry/interpro/ipr999999' });

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'Basic UI/Description',
  decorators: [withProvider, withKnobs],
};
const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

const descriptionWithCitations = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites [[cite:PUB1]]. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();
const citations = [
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

export const Basic = () => <Description textBlocks={[description]} />;

export const WithReferences = () => (
  <>
    <Description
      textBlocks={[descriptionWithCitations]}
      literature={citations}
    />
    <hr />
    <Literature included={citations} />
  </>
);

export const ReadMore = () => (
  <DescriptionReadMore
    text={description}
    minNumberOfCharToShow={number('minNumberOfCharToShow', 100)}
  />
);
