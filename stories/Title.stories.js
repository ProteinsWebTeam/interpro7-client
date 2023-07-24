import React from 'react';

import { Title } from 'components/Title';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});
const withProvider = (story) => <Provider store={store}>{story()}</Provider>;
const withHelmet = (story) => (
  <HelmetProvider>
    <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
    {story()}{' '}
  </HelmetProvider>
);

const databasesPayload = {
  payload: {
    databases: {
      interpro: {
        name: 'InterPro',
      },
      uniprot: {
        name: 'UniProtKB',
      },
      reviewed: {
        name: 'UniProtKB/Swiss-Prot',
      },
      pfam: {
        name: 'Pfam',
      },
      pdb: {
        name: 'PDB',
      },
    },
  },
};

export default {
  title: 'InterPro UI/Title',
  decorators: [withProvider, withHelmet],
};

export const InterproTitle = () => (
  <Title
    metadata={{
      name: {
        name: 'Kringle',
      },
      type: 'domain',
      accession: 'IPR000001',
      source_database: 'interpro',
    }}
    data={databasesPayload}
    entries={[]}
    mainType="entry"
  />
);
export const PfamTitle = () => (
  <Title
    metadata={{
      name: {
        name: 'Piwi domain',
      },
      type: 'domain',
      accession: 'PF02171',
      source_database: 'pfam',
    }}
    data={databasesPayload}
    mainType="entry"
  />
);
export const ProteinTitle = () => (
  <Title
    metadata={{
      length: 462,
      name: {
        name: 'VATB_METVS',
      },
      accession: 'A6UP55',
      source_database: 'reviewed',
    }}
    data={databasesPayload}
    mainType="protein"
  />
);
export const StructureTitle = () => (
  <Title
    metadata={{
      name: {
        name: 'RING-domain heterodimer',
      },
      accession: '1JM7',
      source_database: 'pdb',
      experiment_type: 'Solution NMR',
      release_date: '2009-02-24',
      chains: ['A', 'B'],
    }}
    data={databasesPayload}
    mainType="structure"
  />
);
export const TaxonomyTitle = () => (
  <Title
    metadata={{
      accession: '2',
      source_database: 'uniprot',
      name: {
        name: 'Bacteria',
      },
    }}
    data={databasesPayload}
    mainType="taxonomy"
  />
);
export const ProteomeTitle = () => (
  <Title
    metadata={{
      accession: 'UP000000212',
      name: {
        name: 'Carnobacterium maltaromaticum LMA28',
      },
      source_database: 'uniprot',
    }}
    data={databasesPayload}
    mainType="proteome"
  />
);

export const SetTitle = () => (
  <Title
    metadata={{
      accession: 'CL0001',
      name: {
        name: 'EGF',
      },
      source_database: 'pfam',
    }}
    data={databasesPayload}
    mainType="set"
  />
);
