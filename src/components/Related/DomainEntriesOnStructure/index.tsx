import React from 'react';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import includeProtein, { LoadedProps } from './ProteinViewerLoaded';
import GoToProtVistaMenu from './GoToProtVistaMenu';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts);

const toArrayStructure = (locations: Array<ProtVistaLocation>) =>
  locations.map((loc) => loc.fragments.map((fr) => [fr.start, fr.end]));

export type DataForProteinChain = {
  protein: {
    accession: string;
    length: number;
  };
  data: {
    Entries: Array<{
      accession: string;
      name: string;
      short_name?: string;
      coordinates: number[][][];
      source_database: string;
      locations: ProtVistaLocation[];
      link: string;
      children: unknown;
      chain: string;
      protein: string;
      type: string;
    }>;
    Chain: [
      {
        accession: string;
        coordinates: number[][][];
        locations: ProtVistaLocation[];
        label: string;
        source_database: string;
        type: string;
        protein: string;
      },
    ];
    'Secondary Structure': Array<{
      locations: ProtVistaLocation[];
      type: string;
      accession: string;
      source_database: string;
      chain: string;
    }>;
  };
  chain: string;
  isChimeric?: boolean;
};

const mergeData = (
  secondaryData: StructureLinkedObject[],
  secondaryStructures: SecondaryStructure[]
) => {
  const out: Record<string, Record<string, DataForProteinChain>> = {};
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
            const allFragments: Array<ProtVistaFragment> = [];
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
      source_database: entry.source_database as 'interpro' | MemberDB,
      coordinates: toArrayStructure(entry.entry_protein_locations),
      locations: entry.entry_protein_locations,
      link: `/entry/${entry.source_database}/${entry.accession}`,
      children: entry.children,
      chain: entry.chain,
      protein: entry.protein,
      type: entry.type || entry.entry_type || '',
    });
  }

  const entries = [];
  const chains = Object.keys(out).sort((a, b) => (a ? a.localeCompare(b) : -1));
  for (const chain of chains) {
    const proteins = Object.keys(out[chain]).sort((a, b) =>
      a ? a.localeCompare(b) : -1
    );
    for (const protein of proteins) {
      entries.push(out[chain][protein]);
    }
  }
  return entries;
};

const tagChimericStructures = (data: DataForProteinChain[]) => {
  const proteinsPerChain: Record<string, Array<string>> = {};
  for (const e of data) {
    if (!(e.chain in proteinsPerChain)) proteinsPerChain[e.chain] = [];
    proteinsPerChain[e.chain].push(e.protein.accession);
  }
  for (const e of data) {
    if (proteinsPerChain[e.chain].length > 1) e.isChimeric = true;
  }
};

const protvistaPerChainProtein: Record<
  string,
  React.ComponentType<LoadedProps>
> = {};

type Props = {
  entries: StructureLinkedObject[];
  showChainMenu: boolean;
  secondaryStructures: SecondaryStructure[];
};

const EntriesOnStructure = ({
  entries,
  showChainMenu = false,
  secondaryStructures,
}: Props) => {
  const merged = mergeData(entries, secondaryStructures);
  tagChimericStructures(merged);
  return (
    <>
      {showChainMenu && merged.length > 1 && (
        <GoToProtVistaMenu entries={merged} />
      )}
      <div className={css('row')}>
        {merged.map((e, i) => {
          if (!protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`])
            protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`] =
              includeProtein(e.protein.accession);
          const ProtVistaPlusProtein =
            protvistaPerChainProtein[`${e.chain}-${e.protein.accession}`];

          const tracks = Object.entries(
            e.data as Record<string, Array<Record<string, unknown>>>
          ).sort(([a], [b]) => {
            if (a && a.toLowerCase() === 'chain') return -1;
            if (b && b.toLowerCase() === 'chain') return 1;
            return b ? b.localeCompare(a) : -1;
          });
          return (
            <div key={i} className={css('columns')}>
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
                      className={css('icon', 'icon-conceptual')}
                      data-icon="&#x50;"
                    />{' '}
                    {(e.protein.accession || '').toUpperCase()}
                  </Link>
                  )
                </small>
                {e.isChimeric && (
                  <Tooltip title="This chain maps to a Chimeric protein consisting of two or more proteins">
                    <div className={css('tag')}>
                      <span
                        className={css('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        aria-label="This chain maps to a Chimeric protein consisting of two or more proteins"
                      />{' '}
                      Chimeric
                    </div>
                  </Tooltip>
                )}
              </h4>
              <ProtVistaPlusProtein
                tracks={tracks}
                chain={e.chain}
                fixedHighlight={
                  e.data.Chain &&
                  e.data.Chain.length &&
                  e.data.Chain[0].locations
                    .map((l) =>
                      l.fragments.map((f) => `${f.start}:${f.end}`).join(',')
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

export default EntriesOnStructure;
