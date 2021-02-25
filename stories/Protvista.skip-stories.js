import React from 'react';

import { EntryColorMode } from 'utils/entry-color';

import { ProtVista } from 'components/ProtVista';
import Provider from './Provider';
import configureStore from './configuedStore.js';

const store = configureStore();

const withProvider = (story) => <Provider store={store}>{story()}</Provider>;

export default {
  title: 'InterPro UI/ProtVista',
  decorators: [withProvider],
};
const sequence =
  'MDFFVRLARETGDRKREFLELGRKAGRFPAASTSNGEISIWCSNDYLGMGQHPDVLDAMKRSVDEYGGGSGGSRNTGGTNHFHVALEREPAEPHGKEDAVLFTSGYSANEGSLSVLAGA';

const domains = [
  {
    accession: 'IPR999999',
    protein_length: sequence.length,
    source_database: 'interpro',
    entry_protein_locations: [
      {
        fragments: [{ start: 41, end: 95 }],
      },
    ],
    name: 'Aminotransferase, class I/classII',
    type: 'domain',
    integrated: null,
    children: [
      {
        accession: 'PF99999',
        protein_length: sequence.length,
        source_database: 'pfam',
        entry_protein_locations: [
          {
            fragments: [{ start: 41, end: 95, 'dc-status': 'CONTINUOUS' }],
          },
        ],
        name: 'Aminotransferase class I and II',
        type: 'domain',
        integrated: 'IPR999999',
      },
    ],
  },
];
const secondaryStructure = [
  {
    locations: [
      {
        fragments: [{ shape: 'helix', start: 4, end: 19, fill: 'transparent' }],
      },
      {
        fragments: [{ shape: 'strand', start: 34, end: 79, fill: 'red' }],
      },
    ],
    type: 'secondary_structure',
    accession: 'Chain A',
    source_database: 'PDB',
    chain: 'A',
  },
];

export const JustSequence = () => (
  <ProtVista
    protein={{ sequence, length: sequence.length }}
    data={[]}
    showOptions={false} // Options require a laodData so the button won't be rendered.
  />
);
export const SequenceAndDomains = () => (
  <ProtVista
    protein={{ sequence, length: sequence.length }}
    data={[['Domains', domains]]}
    dataDB={{}}
    colorDomainsBy={EntryColorMode.ACCESSION}
    showOptions={false} // Options require a laodData so the button won't be rendered.
  />
);
export const WithSecondaryStructure = () => (
  <ProtVista
    protein={{ sequence, length: sequence.length }}
    data={[
      ['Secondary Structure', secondaryStructure],
      ['Domains', domains],
    ]}
    dataDB={{}}
    colorDomainsBy={EntryColorMode.DOMAIN_RELATIONSHIP}
    showOptions={false} // Options require a laodData so the button won't be rendered.
  />
);
