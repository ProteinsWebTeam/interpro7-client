import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
const f = foundationPartial(ebiGlobalStyles);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

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
              coordinates: toArrayStructure(entry.structure_protein_locations),
              locations: entry.structure_protein_locations,
              label: `Chain ${entry.chain}`,
              source_database: 'pdb',
              type: 'chain',
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
      children: entry.children,
      chain: entry.chain,
      type: entry.type || entry.entry_type,
    });
  }
  return Object.keys(out)
    .sort((a, b) => a > b)
    .map(k => out[k]);
};

const ProtVistaLoaded = ({ dataprotein, tracks }) => {
  if (dataprotein.loading) return <div>loading</div>;
  return <ProtVista protein={dataprotein.payload.metadata} data={tracks} />;
};
ProtVistaLoaded.propTypes = {
  dataprotein: T.shape({
    loading: T.bool.isRequired,
    payload: T.shape({
      metadata: T.object.isRequired,
    }),
  }).isRequired,
  tracks: T.oneOfType([T.object, T.array]),
};

const includeProtein = accession =>
  loadData({
    getUrl: createSelector(
      state => state.settings.api,
      ({ protocol, hostname, port, root }) =>
        `${protocol}//${hostname}:${port}${root}/protein/uniprot/${accession}`,
    ),
    propNamespace: 'protein',
  })(ProtVistaLoaded);

const protvistaPerChainProtein = {};

const EntriesOnStructure = ({ entries }) => (
  <div className={f('row')}>
    {mergeData(entries).map((e, i) => {
      if (!protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`])
        protvistaPerChainProtein[
          `${e.chain}-${e.protein.accession}`
        ] = includeProtein(e.protein.accession);
      const ProtVistaPlusProtein =
        protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`];
      return (
        <div key={i} className={f('columns')}>
          <h4>
            Chain {e.chain}{' '}
            <small>({(e.protein.accession || '').toUpperCase()})</small>
          </h4>
          <ProtVistaPlusProtein
            tracks={Object.entries(e.data).sort(([a], [b]) => (a > b ? 1 : 0))}
          />
        </div>
      );
    })}
  </div>
);
EntriesOnStructure.propTypes = {
  entries: T.array.isRequired,
};

export default EntriesOnStructure;
