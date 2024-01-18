import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Title } from 'components/Title';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Provider from './Provider';
import configureStore from './configureStore';

const store = configureStore({
  pathname: '/protein/uniprot/',
  search: '?page_size=2',
  hash: 'table',
});

const meta = {
  title: 'InterPro UI/Title',
  component: Title,
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
    (Story) => (
      <HelmetProvider>
        <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
        <Story />
      </HelmetProvider>
    ),
  ],
} satisfies Meta<typeof Title>;

export default meta;
type TitleStory = StoryObj<typeof meta>;

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
  loading: false,
  progress: 1,
  ok: true,
  status: 200,
  url: '',
} as unknown as RequestedData<RootAPIPayload>;

export const InterproTitle: TitleStory = {
  args: {
    metadata: {
      name: {
        name: 'Kringle',
      },
      type: 'domain',
      accession: 'IPR000001',
      source_database: 'interpro',
    } as EntryMetadata as Metadata,
    data: databasesPayload,
    entries: [],
    mainType: 'entry',
  },
};
export const PfamTitle: TitleStory = {
  args: {
    metadata: {
      name: {
        name: 'Piwi domain',
      },
      type: 'domain',
      accession: 'PF02171',
      source_database: 'pfam',
    } as EntryMetadata as Metadata,
    data: databasesPayload,
    mainType: 'entry',
  },
};
export const ProteinTitle: TitleStory = {
  args: {
    metadata: {
      length: 462,
      name: {
        name: 'VATB_METVS',
      },
      accession: 'A6UP55',
      source_database: 'reviewed',
    } as unknown as Metadata,
    data: databasesPayload,
    mainType: 'protein',
  },
};
export const StructureTitle: TitleStory = {
  args: {
    metadata: {
      name: {
        name: 'RING-domain heterodimer',
      },
      accession: '1JM7',
      source_database: 'pdb',
      experiment_type: 'Solution NMR',
      release_date: '2009-02-24',
      chains: ['A', 'B'],
    } as unknown as StructureMetadata,
    data: databasesPayload,
    mainType: 'structure',
  },
};
export const TaxonomyTitle: TitleStory = {
  args: {
    metadata: {
      accession: '2',
      source_database: 'uniprot',
      name: {
        name: 'Bacteria',
      },
    } as unknown as TaxonomyMetadata,
    data: databasesPayload,
    mainType: 'taxonomy',
  },
};

export const ProteomeTitle: TitleStory = {
  args: {
    metadata: {
      accession: 'UP000000212',
      name: {
        name: 'Carnobacterium maltaromaticum LMA28',
      },
      source_database: 'uniprot',
    } as unknown as Metadata,
    data: databasesPayload,
    mainType: 'proteome',
  },
};

export const SetTitle: TitleStory = {
  args: {
    metadata: {
      accession: 'CL0001',
      name: {
        name: 'EGF',
      },
      source_database: 'pfam',
    } as unknown as Metadata,
    data: databasesPayload,
    mainType: 'set',
  },
};
