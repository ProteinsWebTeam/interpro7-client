// @flow
import React from 'react';
import T from 'prop-types';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

import f from 'styles/foundation';

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const mergeData = secondaryData => {
  const out = {};
  for (const entry of secondaryData) {
    if (!(entry.chain in out)) {
      out[entry.chain] = {
        protein: {
          accession: 'P091230',
          length: entry.protein_length,
        },
        data: {
          Entries: [],
          Chain: [
            {
              accession: entry.chain,
              coordinates: toArrayStructure(entry.protein_structure_locations),
              label: `Chain ${entry.chain}`,
              source_database: entry.source_database,
            },
          ],
        },
        chain: entry.chain,
      };
    }
    out[entry.chain].data.Entries.push({
      accession: entry.accession,
      source_database: entry.source_database,
      coordinates: toArrayStructure(entry.entry_protein_locations),
      link: `/entry/${entry.source_database}/${entry.accession}`,
    });
  }
  return Object.keys(out)
    .sort((a, b) => a > b)
    .map(k => out[k]);
};

const EntriesOnStructure = ({ entries }) => (
  <div className={f('row')}>
    {mergeData(entries).map((e, i) => (
      <div key={i} className={f('columns')}>
        <h4>Chain {e.chain}</h4>
        <DomainArchitecture protein={e.protein} data={e.data} />
      </div>
    ))}
  </div>
);
EntriesOnStructure.propTypes = {
  entries: T.array.isRequired,
};

export default EntriesOnStructure;
