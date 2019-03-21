import React from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
const f = foundationPartial(ebiGlobalStyles, fonts);

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
      out[entry.chain] = {};
    }
    if (!(entry.protein in out[entry.chain])) {
      out[entry.chain][entry.protein] = {
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
              protein: entry.protein,
            },
          ],
        },
        chain: entry.chain,
      };
    }
    out[entry.chain][entry.protein].data.Entries.push({
      accession: entry.accession,
      source_database: entry.source_database,
      coordinates: toArrayStructure(entry.entry_protein_locations),
      locations: entry.entry_protein_locations,
      link: `/entry/${entry.source_database}/${entry.accession}`,
      children: entry.children,
      chain: entry.chain,
      protein: entry.protein,
      type: entry.type || entry.entry_type,
    });
  }

  const entries = [];
  const chains = Object.keys(out).sort((a, b) => (a ? a.localeCompare(b) : -1));
  for (const chain of chains) {
    const proteins = Object.keys(out[chain]).sort((a, b) =>
      a ? a.localeCompare(b) : -1,
    );
    for (const protein of proteins) {
      entries.push(out[chain][protein]);
    }
  }
  return entries;
};

const GoToProtVistaMenu = ({ entries }) => (
  <div className={f('row')}>
    <div className={f('column')}>
      <DropDownButton label="Jump To" icon="&#xf124;">
        <ul>
          {entries.map((e, i) => (
            <li key={i}>
              <Link
                to={customLocation => ({
                  ...customLocation,
                  hash: `protvista-${e.chain}-${e.protein.accession}`,
                })}
              >
                Chain {e.chain} ({e.protein.accession})
              </Link>
            </li>
          ))}
        </ul>
      </DropDownButton>
    </div>
  </div>
);
GoToProtVistaMenu.propTypes = {
  entries: T.arrayOf(T.object).isRequired,
};

const ProtVistaLoaded = ({ dataprotein, tracks, fixedHighlight }) => {
  if (dataprotein.loading) return <div>loading</div>;
  return (
    <ProtVista
      protein={dataprotein.payload.metadata}
      data={tracks}
      fixedHighlight={fixedHighlight}
    />
  );
};
ProtVistaLoaded.propTypes = {
  dataprotein: T.shape({
    loading: T.bool.isRequired,
    payload: T.shape({
      metadata: T.object.isRequired,
    }),
  }).isRequired,
  tracks: T.oneOfType([T.object, T.array]),
  fixedHighlight: T.string,
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

const tagChimericStructures = data => {
  const proteinsPerChain = {};
  for (const e of data) {
    if (!(e.chain in proteinsPerChain)) proteinsPerChain[e.chain] = [];
    proteinsPerChain[e.chain].push(e.protein.accession);
  }
  for (const e of data) {
    if (proteinsPerChain[e.chain].length > 1) e.isChimeric = true;
  }
};
const protvistaPerChainProtein = {};

const EntriesOnStructure = ({ entries, showChainMenu = false }) => {
  const merged = mergeData(entries);
  tagChimericStructures(merged);
  return (
    <>
      {showChainMenu && merged.length > 1 && (
        <GoToProtVistaMenu entries={merged} />
      )}
      <div className={f('row')}>
        {merged.map((e, i) => {
          if (!protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`])
            protvistaPerChainProtein[
              `${e.chain}-${e.protein.accession}`
            ] = includeProtein(e.protein.accession);
          const ProtVistaPlusProtein =
            protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`];
          return (
            <div key={i} className={f('columns')}>
              <h4 id={`protvista-${e.chain}-${e.protein.accession}`}>
                Chain {e.chain}{' '}
                <small>
                  (
                  <Link
                    to={{
                      description: {
                        main: { key: 'protein' },
                        protein: {
                          db: 'uniprot',
                          accession: e.protein.accession,
                        },
                      },
                    }}
                  >
                    {(e.protein.accession || '').toUpperCase()}
                  </Link>
                  )
                </small>
                {e.isChimeric && (
                  <Tooltip title="This chain maps to a Chimeric protein consisting of two or more proteins">
                    <div className={f('tag')}>
                      <span
                        className={f('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        aria-label="This chain maps to a Chimeric protein consisting of two or more proteins"
                      />{' '}
                      Chimeric
                    </div>
                  </Tooltip>
                )}
              </h4>
              <ProtVistaPlusProtein
                tracks={Object.entries(e.data).sort(([a], [b]) => {
                  if (a && a.toLowerCase() === 'chain') return -1;
                  if (b && b.toLowerCase() === 'chain') return 1;
                  return b ? b.localeCompare(a) : -1;
                })}
                fixedHighlight={
                  e.data.Chain &&
                  e.data.Chain.length &&
                  e.data.Chain[0].locations
                    .map(l =>
                      l.fragments.map(f => `${f.start}:${f.end}`).join(','),
                    )
                    .join(',')
                }
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
EntriesOnStructure.propTypes = {
  entries: T.array.isRequired,
  showChainMenu: T.bool,
};

export default EntriesOnStructure;
