// @flow
import React from 'react';
import T from 'prop-types';

import DomainArchitecture from 'components/Protein/DomainArchitecture';

import f from 'styles/foundation';
import Protvista from 'components/Protvista';
import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { stringify as qsStringify } from 'query-string';

const toArrayStructure = locations =>
  locations.map(loc => loc.fragments.map(fr => [fr.start, fr.end]));

const mergeData = secondaryData => {
  const out = {};
  for (const entry of secondaryData) {
    if (!(entry.chain in out)) {
      out[entry.chain] = {
        protein: {
          accession: entry.protein,
          length: entry.protein_length,
        },
        data: {
          Entries: [],
          Chain: [
            {
              accession: entry.chain,
              coordinates: toArrayStructure(entry.protein_structure_locations),
              locations: entry.protein_structure_locations,
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
      locations: entry.entry_protein_locations,
      link: `/entry/${entry.source_database}/${entry.accession}`,
    });
  }
  return Object.keys(out)
    .sort((a, b) => a > b)
    .map(k => out[k]);
};

const ProtvistaLoaded = ({ dataprotein, tracks }) => {
  if (dataprotein.loading) return <div>loading</div>;
  return <Protvista protein={dataprotein.payload.metadata} data={tracks} />;
};
const includeProtein = accession =>
  loadData({
    getUrl: createSelector(
      state => state.settings.api,
      ({ protocol, hostname, port, root }) =>
        `${protocol}//${hostname}:${port}${root}/protein/uniprot/${accession}`,
    ),
    propNamespace: 'protein',
  })(ProtvistaLoaded);
const protvistaPerChain = {};
const EntriesOnStructure = ({ entries }) => {
  return (
    <div className={f('row')}>
      {mergeData(entries).map((e, i) => {
        if (!protvistaPerChain[e.chain])
          protvistaPerChain[e.chain] = includeProtein(e.protein.accession);
        const ProtvistaPlusProtein = protvistaPerChain[e.chain];
        return (
          <div key={i} className={f('columns')}>
            <h4>Chain {e.chain}</h4>
            {/*<DomainArchitecture protein={e.protein} data={e.data} />*/}
            <ProtvistaPlusProtein
              tracks={Object.entries(e.data).sort(
                ([a], [b]) => (a > b ? 1 : -1),
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
EntriesOnStructure.propTypes = {
  entries: T.array.isRequired,
};

export default EntriesOnStructure;
