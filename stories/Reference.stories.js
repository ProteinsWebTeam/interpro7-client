import React from 'react';
import Literature from '../src/components/Entry/Literature';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/Reference',
  decorators: [withProvider],
};

const citation = {
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

export const Basic = () => (
  <Literature extra={citation.extra} included={citation.included} />
);
