import React, { useEffect, useRef } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { format } from 'url';

const f = foundationPartial(ebiGlobalStyles, fonts);

const ProtVista = loadable({
  loader: () =>
    import(/* webpackChunkName: "protvista" */ 'components/ProtVista'),
});

const toArrayStructure = (locations) =>
  locations.map((loc) => loc.fragments.map((fr) => [fr.start, fr.end]));

const mergeData = (secondaryData, secondaryStructures) => {
  const out = {};
  for (const entry of secondaryData) {
    if (!(entry.chain in out)) {
      out[entry.chain] = {};
    }
    if (!(entry.protein in out[entry.chain])) {
      // Merging the secondary structures data per chain
      const secondaryStructArray = [];
      if (secondaryStructures) {
        for (const structure of secondaryStructures) {
          // eslint-disable-next-line max-depth
          if (entry.chain === structure.accession) {
            const allFragments = [];
            structure.locations.forEach((loc) => {
              loc.fragments.forEach((f) => {
                if (f.shape === 'helix') {
                  f.fill = 'transparent';
                  allFragments.push({ ...f });
                } else {
                  allFragments.push({ ...f });
                }
              });
            });
            const newLocations = [];
            // eslint-disable-next-line max-depth
            for (const f of allFragments) {
              // To be consistent with the expected structure loc = [{fragments: [{}]}]
              newLocations.push({ fragments: [{ ...f }] });
            }
            secondaryStructArray.push({
              locations: newLocations,
              type: 'secondary_structure',
              accession: `Chain ${structure.accession}`,
              source_database: 'PDB',
              chain: structure.accession,
            });
          }
        }
      }

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
          'Secondary Structure': secondaryStructArray,
        },
        chain: entry.chain,
      };
    }
    out[entry.chain][entry.protein].data.Entries.push({
      accession: entry.accession,
      name: entry.name,
      short_name: entry.short_name,
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

const scrollToElementByID = (id) => {
  document.getElementById(id)?.scrollIntoView();
};
const GoToProtVistaMenu = ({ entries } /*: Array<Object> */) => (
  <div className={f('row')}>
    <div className={f('column')}>
      <DropDownButton label="Jump To" icon="&#xf124;">
        <ul>
          {entries.map((e, i) => {
            const elementID = `protvista-${e.chain}-${e.protein.accession}`;
            return (
              <li key={i}>
                <Link
                  to={(customLocation) => ({
                    ...customLocation,
                    hash: elementID,
                  })}
                  onClick={() => scrollToElementByID(elementID)}
                >
                  Chain {e.chain} ({e.protein.accession})
                </Link>
              </li>
            );
          })}
        </ul>
      </DropDownButton>
    </div>
  </div>
);

GoToProtVistaMenu.propTypes = {
  entries: T.arrayOf(T.object).isRequired,
};

const ProtVistaLoaded = (
  { dataprotein, tracks, dataGenome3d, chain, fixedHighlight, id } /*: {
  dataprotein: {loading: boolean, payload: {metadata: Object}},
  tracks: Object | Array<Object>,
  dataGenome3d: {loading: boolean, payload: {metadata: Object}, status: number},
  chain: string,
  fixedHighlight: string,
  id: string
 } */,
) => {
  const protvistaEl = useRef(null);
  useEffect(() => {
    if (!protvistaEl.current || !protvistaEl.current.addEventListener) return;
    const handleMouseover = (event) => {
      const {
        detail: { eventType, highlight, feature },
      } = event;
      if (eventType === 'mouseover' && feature.aa) {
        protvistaEl.current.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              highlight,
              eventType: 'sequence-chain',
              chain,
              protein: dataprotein.payload.metadata.accession,
            },
            bubbles: true,
            cancelable: true,
          }),
        );
      }
    };
    protvistaEl.current.addEventListener('change', handleMouseover);

    return () => {
      if (protvistaEl.current)
        protvistaEl.current.removeEventListener('change', handleMouseover);
    };
  });

  const enrichedTracks = [...tracks];
  const HTTP_OK = 200;

  if (
    !dataGenome3d.loading &&
    !dataprotein.loading &&
    dataGenome3d.status === HTTP_OK
  ) {
    const domains = dataGenome3d.payload.data
      .map((d) => d.annotations)
      .flat(1)
      .filter(
        ({ uniprot_acc: protein }) =>
          protein === dataprotein.payload.metadata.accession,
      );
    const domainsObj = {};
    for (const d of domains) {
      if (!(d.resource in domainsObj)) {
        domainsObj[d.resource] = {
          locations: [],
        };
      }
      domainsObj[d.resource].accession = `G3D:${d.resource}`;
      domainsObj[d.resource].confidence = d.confidence;
      domainsObj[d.resource].protein = dataprotein.payload.metadata.accession;
      domainsObj[d.resource].type = 'Predicted structural domain';
      domainsObj[d.resource].source_database = d.resource;
      domainsObj[d.resource].locations.push({
        fragments: d.segments.map((s) => ({
          start: s.uniprot_start,
          end: s.uniprot_stop,
        })),
      });
    }
    enrichedTracks.push([
      'predicted_structural_domains_(Provided_by_genome3D)',
      Object.values(domainsObj),
    ]);
  }
  return (
    <div ref={protvistaEl}>
      {dataprotein.loading ? (
        <div>loading</div>
      ) : (
        <ProtVista
          protein={dataprotein.payload.metadata}
          data={enrichedTracks}
          fixedHighlight={fixedHighlight}
          id={id}
        />
      )}
    </div>
  );
};
ProtVistaLoaded.propTypes = {
  dataprotein: dataPropType.isRequired,
  dataGenome3d: dataPropType.isRequired,
  tracks: T.oneOfType([T.object, T.array]),
  chain: T.string,
  fixedHighlight: T.string,
  id: T.string,
};

const getGenome3dURL = createSelector(
  (state) => state.settings.genome3d,
  (state) => state.customLocation.description.structure.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}classification/11/pdb/${accession}`,
      // TODO: Replace 11 for latest once included in the genome3d api
    });
  },
);

const includeProtein = (accession) =>
  loadData({
    getUrl: getGenome3dURL,
    propNamespace: 'Genome3d',
  })(
    loadData({
      getUrl: createSelector(
        (state) => state.settings.api,
        ({ protocol, hostname, port, root }) =>
          `${protocol}//${hostname}:${port}${root}/protein/uniprot/${accession}`,
      ),
      propNamespace: 'protein',
    })(ProtVistaLoaded),
  );

const tagChimericStructures = (data) => {
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

const EntriesOnStructure = (
  {
    entries,
    showChainMenu = false,
    secondaryStructures,
  } /*: {entries: Array<Object>, showChainMenu: boolean, secondaryStructures: Array<Object>} */,
) => {
  const merged = mergeData(entries, secondaryStructures);
  tagChimericStructures(merged);
  return (
    <>
      {showChainMenu && merged.length > 1 && (
        <GoToProtVistaMenu entries={merged} />
      )}
      <div className={f('row')}>
        {merged.map((e, i) => {
          if (!protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`])
            protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`] =
              includeProtein(e.protein.accession);
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
                    <span
                      className={f('icon', 'icon-conceptual')}
                      data-icon="&#x50;"
                    />{' '}
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
                chain={e.chain}
                fixedHighlight={
                  e.data.Chain &&
                  e.data.Chain.length &&
                  e.data.Chain[0].locations
                    .map((l) =>
                      l.fragments.map((f) => `${f.start}:${f.end}`).join(','),
                    )
                    .join(',')
                }
                id={`${e.chain}-${e.protein.accession}`}
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
  secondaryStructures: T.array,
};

export default EntriesOnStructure;
