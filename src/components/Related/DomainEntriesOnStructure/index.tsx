import React, { useMemo } from 'react';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import ProteinViewerForStructure from './ProteinViewerLoaded';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { orderByAccession } from 'components/Related/DomainsOnProtein/utils';
import { flattenTracksObject } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

import { DataForProteinChain, mergeChimericProteins } from './utils';

import { ExtendedFeature } from 'src/components/ProteinViewer/utils';

const css = cssBinder(fonts);

function getBoundaries(item: ExtendedFeature | ExtendedFeature[]) {
  let fragment = undefined;
  let accession = undefined;

  if (Array.isArray(item)) {
    fragment = item[0].locations?.[0].fragments?.[0];
    accession = item[0].accession;
  } else {
    fragment = item.locations?.[0].fragments?.[0];
    accession = item.accession;
  }
  if (fragment && accession) {
    return [accession, fragment.start, fragment.end];
  }
  return [0, 0];
}

export function sortTracks(
  a: ExtendedFeature | ExtendedFeature[],
  b: ExtendedFeature | ExtendedFeature[],
) {
  const [aAccession, aStart, aEnd] = getBoundaries(a);
  const [bAccession, bStart, bEnd] = getBoundaries(b);

  if (aStart > bStart) return 1;
  if (aStart < bStart) return -1;
  if (aStart === bStart) {
    if (aEnd < bEnd) return 1;
    if (aEnd > bEnd) return -1;
    if (aEnd === bEnd) {
      if (aAccession > bAccession) return 1;
      else return -1;
    }
  }
  return 0;
}

const isAccessionIn = (
  accession: string,
  proteins: { accession: string; length: number }[],
) => {
  return proteins.some((proteinobj) => proteinobj.accession === accession);
};

const toArrayStructure = (locations: Array<ProtVistaLocation>) =>
  locations.map((loc) => loc.fragments.map((fr) => [fr.start, fr.end]));

const mergeData = (
  secondaryData: StructureLinkedObject[],
  secondaryStructures?: SecondaryStructure[],
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

      let proteinObjs: { accession: string; length: number }[] = [];

      proteinObjs = proteinObjs?.concat({
        accession: entry.protein,
        length: entry.protein_length,
      });

      entry.children?.map((child) => {
        if (
          child.protein &&
          child.protein_length &&
          !isAccessionIn(child.protein, proteinObjs)
        ) {
          proteinObjs.push({
            accession: child.protein,
            length: child.protein_length,
          });
        }
      });

      out[entry.chain][entry.protein] = {
        protein: proteinObjs,
        sequence: {
          sequence: entry.sequence,
          length: entry.sequence_length,
        },
        data: {
          secondary_structure: secondaryStructArray,
        },
        chain: entry.chain,
      };
    }

    const dataType = entry.type;

    if (!out[entry.chain][entry.protein].data[dataType as string]) {
      out[entry.chain][entry.protein].data[dataType as string] = [];
    }

    out[entry.chain][entry.protein].data[dataType as string].push({
      accession: entry.accession,
      name: entry.name,
      short_name: entry.short_name,
      source_database: entry.source_database as 'interpro' | MemberDB,
      coordinates: toArrayStructure(entry.entry_structure_locations),
      locations: entry.entry_structure_locations,
      link: `/entry/${entry.source_database}/${entry.accession}`,
      children: entry.children?.map(
        ({ entry_protein_locations, entry_structure_locations, ...child }) => ({
          ...child,
          locations: entry_structure_locations,
        }),
      ),
      chain: entry.chain,
      protein: entry.protein,
      type: entry.type || entry.entry_type || '',
    });
  }

  // Logic to handle cases where a single chain maps to multiple UniPro accessions
  // Leave the steps above as they are now, just in case we need to go back.
  for (const entry of secondaryData) {
    if (Object.keys(out[entry.chain]).length > 1) {
      out[entry.chain] = { ...mergeChimericProteins(out[entry.chain]) };
    }
  }

  const entries = [];
  const chains = Object.keys(out).sort((a, b) => (a ? a.localeCompare(b) : -1));
  for (const chain of chains) {
    const proteins = Object.keys(out[chain]).sort((a, b) =>
      a ? a.localeCompare(b) : -1,
    );
    for (const protein of proteins) {
      Object.values(out[chain][protein].data).forEach((g) =>
        g.sort(orderByAccession),
      );
      entries.push(out[chain][protein]);
    }
  }
  return entries;
};

const getRepresentativesPerChain = (
  representativeDomains?: Record<string, unknown>[],
) => {
  const representativesPerChain: Record<string, Array<MinimalFeature>> = {};
  if (representativeDomains?.length) {
    representativeDomains.forEach((domain) => {
      if (domain.chain) {
        if (!representativesPerChain[domain.chain as string])
          representativesPerChain[domain.chain as string] = [];
        representativesPerChain[domain.chain as string].push(
          domain as MinimalFeature,
        );
      }
    });
  }
  return representativesPerChain;
};

type Props = {
  structure: string;
  entries: StructureLinkedObject[];
  unintegrated: StructureLinkedObject[];
  secondaryStructures?: SecondaryStructure[];
  representativeDomains?: Record<string, unknown>[];
  representativeFamilies?: Record<string, unknown>[];
};

const EntriesOnStructure = ({
  entries,
  unintegrated,
  secondaryStructures,
  structure,
  representativeDomains,
  representativeFamilies,
}: Props) => {
  const merged = useMemo(() => {
    const data = mergeData(entries.concat(unintegrated), secondaryStructures);
    return data;
  }, [entries, unintegrated, secondaryStructures]);

  const representativesDomainsPerChain = useMemo(
    () => getRepresentativesPerChain(representativeDomains),
    [representativeDomains],
  );

  const representativesFamiliesPerChain = useMemo(
    () => getRepresentativesPerChain(representativeFamilies),
    [representativeFamilies],
  );

  const reorganizeStructureViewer = (
    chain: string,
    tracks: ProteinViewerDataObject,
  ): ProteinViewerDataObject => {
    try {
      const newTracks = JSON.parse(JSON.stringify(tracks));

      if (!newTracks['domain']) {
        newTracks['domain'] = [];
      }

      if (!newTracks['family']) {
        newTracks['family'] = [];
      }

      // Move homologous superfamily to domains
      const homologousSuperFamilies = newTracks['homologous_superfamily'];
      if (newTracks['domain'] && homologousSuperFamilies) {
        newTracks['domain'] = newTracks['domain'].concat(
          homologousSuperFamilies,
        );
        newTracks['homologous_superfamily'] = [];
      }

      const representativeDomains = representativesDomainsPerChain[chain];
      if (newTracks['domain'] && representativeDomains)
        newTracks['domain'] = newTracks['domain'].concat(representativeDomains);

      const representativeFamilies = representativesFamiliesPerChain[chain];
      if (newTracks['family'] && representativeFamilies)
        newTracks['family'] = newTracks['family'].concat(
          representativeFamilies,
        );

      console.log(chain, 'fix', newTracks);
      return newTracks;
    } catch (err) {
      return {};
    }
  };

  return (
    <>
      <div className={css('vf-stack', 'vf-stack--400')}>
        {merged.map((e, i) => {
          const sequenceData = {
            accession: `${e.chain}-${structure}`,
            ...e.sequence,
          };

          const reorganizedTracks = reorganizeStructureViewer(e.chain, e.data);
          const tracks = flattenTracksObject(reorganizedTracks);

          tracks.map((entry) => {
            (entry[1] as ExtendedFeature[]).sort(sortTracks).flat();
          });

          let accessionList: string[] = [];
          const splitAccessions = e.protein
            ?.map((p) => p.accession)
            .map((pAccession) => pAccession.split(','))
            .flat();
          accessionList = accessionList.concat(splitAccessions);
          accessionList = Array.from(new Set(accessionList));

          return (
            <div key={i} className={css('vf-stack')}>
              <h4 id={`protvista-${e.chain}`}>
                Chain {e.chain}
                {accessionList.length > 0 && ' ('}
                {accessionList &&
                  accessionList.map((acc, idx) => {
                    return (
                      <small>
                        <Link
                          to={{
                            description: {
                              main: { key: 'protein' },
                              protein: {
                                db: 'uniprot',
                                accession: acc,
                              },
                            },
                          }}
                        >
                          {(acc || '').toUpperCase()}
                        </Link>
                        {idx !== accessionList.length - 1 ? ', ' : ''}
                      </small>
                    );
                  })}
                {accessionList.length > 0 && ')'}
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
              <ProteinViewerForStructure
                tracks={
                  tracks as Array<[string, Array<Record<string, unknown>>]>
                }
                chain={e.chain}
                id={`${e.chain}`}
                protein={sequenceData}
                viewerType={'structures'}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EntriesOnStructure;
