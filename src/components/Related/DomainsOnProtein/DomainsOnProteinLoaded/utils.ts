import { match } from 'assert';
import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'components/ProteinViewer/utils';
import { selectRepresentativeData } from 'components/ProteinViewer/utils';

/// UTILS
export const UNDERSCORE = /_/g;

const FIRST_IN_ORDER = [
  'alphafold_confidence',
  'bfvd_confidence',
  'secondary_structure',
  'family',
  'domain',
  'intrinsically_disordered_regions',
  'conserved_site',
  'residues',
  'spurious_proteins',
  'pathogenic_and_likely_pathogenic_variants',
  'repeat',
  'active_site',
  'binding_site',
  'ptm',
];

export const LASTS_IN_ORDER = [
  'coiled-coils,_signal_peptides,_transmembrane_regions',
  'short_linear_motifs',
  'pfam-n',
  'funfam',
  'match_conservation',
];

export const byEntryType = (
  [a, _]: [string, unknown],
  [b, __]: [string, unknown],
) => {
  for (const label of FIRST_IN_ORDER) {
    if (a.toLowerCase() === label) return -1;
    if (b.toLowerCase() === label) return 1;
  }
  for (const l of LASTS_IN_ORDER) {
    if (a.toLowerCase() === l) return -1;
    if (b.toLowerCase() === l) return 1;
  }
  return a > b ? 1 : 0;
};

export function getBoundaries(item: ExtendedFeature | ExtendedFeature[]) {
  let fragment = undefined;
  let accession = undefined;

  if (Array.isArray(item)) {
    if (item[0].entry_protein_locations)
      fragment = item[0].entry_protein_locations?.[0].fragments?.[0];
    else fragment = item[0].locations?.[0].fragments?.[0];
    accession = item[0].accession;
  } else {
    if (item.entry_protein_locations)
      fragment = item.entry_protein_locations?.[0].fragments?.[0];
    else fragment = item.locations?.[0].fragments?.[0];
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

/* #### STANDARDIZATION FUNCTIONS #### */
export const standardizeResidueStructure = (
  residues: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newResidues: Array<ExtendedFeature> = [];

  residues.forEach((residueParentObj) => {
    const tempResidue: ExtendedFeature = residueParentObj;
    if (residueParentObj.accession.startsWith('PIRSR')) {
      tempResidue.type = 'residue';
      tempResidue.locations =
        residueParentObj.residues?.[0].locations || tempResidue.locations;
    } else if (residueParentObj.accession.startsWith('residue:')) {
    }
    newResidues.push(tempResidue);
  });
  return newResidues;
};

export const standardizeMobiDBFeatureStructure = (
  features: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newFeatures: Array<ExtendedFeature> = [];
  features.forEach((feature) => {
    const tempFeature = { ...feature };
    const slicedTempFeatureLocations: Array<ExtendedFeatureLocation> = [];
    const featureChildrenRecord: Record<string, ExtendedFeature> = {};

    tempFeature.accession = 'Mobidblt-Consensus Disorder Prediction';
    tempFeature.source_database = 'mobidblt';
    tempFeature.protein = '';

    tempFeature.locations?.forEach(
      (
        location: ExtendedFeatureLocation & {
          'sequence-feature'?: string;
          start?: number;
          end?: number;
        },
        idx: number,
      ) => {
        if (
          location['sequence-feature'] &&
          location['sequence-feature'] !== ''
        ) {
          if (location.start && location.end) {
            const restructuredLocation: ExtendedFeatureLocation = {
              fragments: [
                {
                  start: location.start,
                  end: location.end,
                  seq_feature: location['sequence-feature'],
                },
              ],
            };
            if (
              featureChildrenRecord[location['sequence-feature']] &&
              restructuredLocation
            ) {
              featureChildrenRecord[
                location['sequence-feature']
              ].locations?.push(restructuredLocation);
            } else {
              const tempChild: ExtendedFeature = {
                accession: location['sequence-feature'],
                source_database: 'mobidblt',
                locations: [restructuredLocation],
              };
              featureChildrenRecord[location['sequence-feature']] = tempChild;
            }
          }
        } else {
          slicedTempFeatureLocations.push(location);
        }
      },
    );
    tempFeature.locations = slicedTempFeatureLocations;
    tempFeature.children = Object.values(featureChildrenRecord);
    newFeatures.push(tempFeature);
  });
  return newFeatures;
};
/* #### END STANDARDIZATION FUNCTIONS #### */

// Support functions for representative data
function isInterProN(
  matches: ExtendedFeature[] | InterProN_Match[],
): matches is InterProN_Match[] {
  return true;
}

const processRepresentativeData = (
  matches: ExtendedFeature[] | InterProN_Match[],
): MinimalFeature[] => {
  // Representative data logic
  const representativeDomains = selectRepresentativeData(
    matches,
    'entry_protein_locations',
    'domain',
  );

  representativeDomains.forEach((domain) => {
    if (domain.integrated)
      domain.integrated = (domain.integrated as ExtendedFeature).accession;
  });

  const representativeFamilies = selectRepresentativeData(
    matches,
    'entry_protein_locations',
    'family',
  );

  representativeFamilies.forEach((family) => {
    if (family.integrated)
      family.integrated = (family.integrated as ExtendedFeature).accession;
  });

  const representativeData = representativeDomains.concat(
    representativeFamilies,
  );

  // Signal to PV that this match comes from InterPro-N for visualization purposes
  if (isInterProN(matches)) {
    representativeData.forEach(
      (match) => (match.accession = match.accession + ':nMatch'),
    );
  }
  return representativeData as MinimalFeature[];
};

/* #### INTEPRO_N FUNCTIONS #### */
function processInterProN_Matches(
  type: string,
  interproN_Matches: Record<string, InterProN_Match>,
  mode: string,
):
  | MinimalFeature[]
  | [MinimalFeature[], Map<string, ExtendedFeature>, string[]]
  | [MinimalFeature[], Map<string, ExtendedFeature>] {
  let processedInterProN_Matches: MinimalFeature[] = [];

  // Get deep copy of unintegrated entries
  const unintegratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InterProN_Match) => {
        return (
          !match.integrated &&
          match.type === type &&
          (mode === 'best' ? match.is_preferred : true)
        );
      }),
    ),
  );

  unintegratedInterProN_Matches.forEach((match: MinimalFeature) => {
    match.accession = match.accession + ':nMatch';
  });

  // Get deep copy of integrated entries
  const integratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InterProN_Match) => {
        return (
          match.integrated &&
          match.type === type &&
          (mode === 'best' ? match.is_preferred : true)
        );
      }),
    ),
  );

  integratedInterProN_Matches.forEach((match: MinimalFeature) => {
    match.accession = match.accession + ':nMatch';
  });

  // Add representative data, filtering only by type
  const typeFilteredInterpro_NMatches = Object.values(interproN_Matches).filter(
    (match: InterProN_Match) => match.type === type,
  );
  const representativeData = processRepresentativeData(
    typeFilteredInterpro_NMatches,
  );

  // Create map <integrated_accession: integrated_entryobj> to append integrated matches as children later
  let integratedInterProN_Map: Map<string, ExtendedFeature> = new Map();
  if (integratedInterProN_Matches.length > 0) {
    integratedInterProN_Matches.forEach(
      (entry: { integrated?: { accession: string } }) => {
        integratedInterProN_Map.set(
          entry.integrated?.accession as string,
          entry.integrated as ExtendedFeature,
        );
      },
    );
  }

  if (integratedInterProN_Map) {
    for (let i = 0; i < integratedInterProN_Matches.length; i++) {
      // Edit base match entry obj so that the integrated field is just the integrated accession and not the whole entry
      const tempInterproN_Match = { ...integratedInterProN_Matches[i] };
      const integratedAccession: string =
        tempInterproN_Match.integrated.accession;
      tempInterproN_Match.integrated = integratedAccession;

      // Append that new match object to the children list of the integrated "parent" entry
      const interproMapEntry: ExtendedFeature | null =
        integratedInterProN_Map.get(integratedAccession) || null;

      if (interproMapEntry) {
        interproMapEntry.entry_protein_locations =
          tempInterproN_Match.entry_protein_locations;
        interproMapEntry.accession = interproMapEntry.accession + ':nMatch';
        integratedInterProN_Map.set(integratedAccession, interproMapEntry);
        if (interproMapEntry?.children) {
          interproMapEntry.children.push(tempInterproN_Match);
          integratedInterProN_Map.set(integratedAccession, interproMapEntry);
        } else {
          interproMapEntry.children = [tempInterproN_Match];
          integratedInterProN_Map.set(integratedAccession, interproMapEntry);
        }
      }
    }
  }

  // Merge unintegrated and integrated
  processedInterProN_Matches = unintegratedInterProN_Matches.concat(
    Array.from(integratedInterProN_Map.values()),
  );

  // Return n-match representative data, in all other cases the representative data is the one from HMMs
  if (mode === 'n-only') {
    processedInterProN_Matches = processedInterProN_Matches.concat(
      representativeData as MinimalFeature[],
    );
  }

  // In best mode, return the unintegrated, the map with the integrated that are preferred and a list of already seen match accessions (see choseBest function below)
  else if (mode === 'best') {
    const bestMatches = Object.entries(interproN_Matches).filter(
      (match) => match[1].is_preferred && type == match[1].type,
    );

    return [
      unintegratedInterProN_Matches,
      integratedInterProN_Map,
      bestMatches.map((match) => match[0]),
    ];
  } else if (mode === 'stacked') {
    return [unintegratedInterProN_Matches, integratedInterProN_Map];
  }

  return processedInterProN_Matches;
}

function chooseBestMatch(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InterProN_Match>,
): MinimalFeature[] {
  const processingResult = processInterProN_Matches(
    type,
    interproNMatches,
    'best',
  );

  // Best unintegrated matches
  let processedUnintegratedInterProN_Matches: ExtendedFeature[] =
    processingResult[0] as ExtendedFeature[];

  // Map with best integrated matches
  let processedIntegratedMapInterPro_NMatches: Map<string, ExtendedFeature> =
    processingResult[1] as Map<string, ExtendedFeature>;

  // List of best matches (unintegrated and integrated)
  const bestMatchesList = processingResult[2] as string[];

  // Retrieve traditional unintegrated matches that were not already in the InterproN matches and choosen as the preferred
  const baseMatchesObjUnintegrated: ExtendedFeature[] = Object.values(
    traditionalMatches,
  ).filter((match: ExtendedFeature) => {
    return (
      match.type === type &&
      !bestMatchesList.includes(match.accession) &&
      !match.integrated &&
      !match.accession.startsWith('IPR')
    );
  });

  // Retrieve traditional integrated matches that were not alredy in the InterproN matches and choosen as the preferred
  const baseMatchesObjIntegrated: ExtendedFeature[] = Object.values(
    traditionalMatches,
  ).filter((match: ExtendedFeature) => {
    return match.type === type && match.accession.startsWith('IPR');
  }) as ExtendedFeature[];

  /*  Rebuild integrated matches structure (including children), appending matches to already existing preferred Intepro-N matches or traditional matches.
      NOTES:
      In an integrated entry there could be a match coming from Interpro-N and one coming from traditional HMMs.
      That's why this logic is on a match basis and not on an integrated entry basis. (different objects, child vs parent)
  */

  baseMatchesObjIntegrated.map((integratedEntry: ExtendedFeature) => {
    integratedEntry.children?.map((integratedEntryMatch: ExtendedFeature) => {
      if (!bestMatchesList.includes(integratedEntryMatch.accession)) {
        let alreadyIntegratedEntry =
          processedIntegratedMapInterPro_NMatches.get(
            integratedEntry.accession,
          );
        if (alreadyIntegratedEntry) {
          alreadyIntegratedEntry.children?.push(integratedEntryMatch);
          processedIntegratedMapInterPro_NMatches.set(
            integratedEntry.accession,
            alreadyIntegratedEntry,
          );
        } else {
          alreadyIntegratedEntry = { ...integratedEntry };
          alreadyIntegratedEntry.children = [integratedEntryMatch];
          processedIntegratedMapInterPro_NMatches.set(
            integratedEntry.accession,
            alreadyIntegratedEntry,
          );
        }
      }
    });
  });

  // Add representative data. The unintegrated do not have to be filtered based on the best list in this case.
  const unintegratedTraditionalMatchesObj: ExtendedFeature[] = Object.values(
    traditionalMatches,
  ).filter((match: ExtendedFeature) => {
    return (
      match.type === type &&
      !match.integrated &&
      !match.accession.startsWith('IPR')
    );
  });

  let flatIntegratedTraditionalMatchesObj: ExtendedFeature[] = [];

  baseMatchesObjIntegrated.forEach((match) => {
    if (match.children)
      flatIntegratedTraditionalMatchesObj =
        flatIntegratedTraditionalMatchesObj.concat(match.children);
  });

  const representativeData = processRepresentativeData(
    flatIntegratedTraditionalMatchesObj.concat(
      unintegratedTraditionalMatchesObj,
    ),
  );

  return processedUnintegratedInterProN_Matches
    .concat(baseMatchesObjUnintegrated)
    .concat(
      Array.from(processedIntegratedMapInterPro_NMatches.values()).concat(
        representativeData,
      ),
    ) as MinimalFeature[];
}

function combineMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproN_Matches: Record<string, InterProN_Match>,
): ExtendedFeature[] {
  // Get processed Interpro-N matches
  const processedResult = processInterProN_Matches(
    type,
    interproN_Matches,
    'stacked',
  ) as [MinimalFeature[], Map<string, ExtendedFeature>];

  const unintegratedInterProN_Matches = processedResult[0];
  const unintegratedInterProN_MatchesMap: Record<string, MinimalFeature> = {};

  unintegratedInterProN_Matches.forEach((match) => {
    const newMatch = JSON.parse(JSON.stringify(match));
    const baseAccession = match.accession.replace(':nMatch', '');

    unintegratedInterProN_MatchesMap[baseAccession] = {
      accession: 'parentUnintegrated:' + baseAccession,
      locations: (match as InterProN_Match).entry_protein_locations,
      source_database: match.source_database,
      children: [newMatch as { accession: string; source_database: string }],
    };
  });

  // Unintegrated matches processing logic: combine unintegrated matches from InterPro-N and HMMs under the same "Unintegrated" parent element
  const unintegratedTraditionalMatchesObj: ExtendedFeature[] = Object.values(
    traditionalMatches,
  ).filter((match: ExtendedFeature) => {
    return match.type === type && !match.accession.startsWith('IPR');
  });

  unintegratedTraditionalMatchesObj.forEach((match) => {
    const newMatch = JSON.parse(JSON.stringify(match));
    const baseAccession = match.accession.replace(':nMatch', '');

    if (unintegratedInterProN_MatchesMap[match.accession]) {
      unintegratedInterProN_MatchesMap[match.accession].children?.push(
        newMatch as { accession: string; source_database: string },
      );
    } else {
      unintegratedInterProN_MatchesMap[baseAccession] = {
        accession: 'parentUnintegrated:' + baseAccession,
        locations: (match as InterProN_Match).entry_protein_locations,
        source_database: match.source_database,
        children: [newMatch as { accession: string; source_database: string }],
      };
    }
  });

  // Integrated matches processing logic: combine integrated matches from InterPro-N and HMMs under the same InterPro entry parent element
  const integratedInterProN_Map = processedResult[1];
  let flatIntegratedTraditionalMatchesObj: ExtendedFeature[] = [];

  const integratedTraditionalMatchesObj: ExtendedFeature[] = Object.values(
    traditionalMatches,
  ).filter((match: ExtendedFeature) => {
    return match.type === type && match.accession.startsWith('IPR');
  });

  integratedTraditionalMatchesObj.forEach((match) => {
    if (match.children)
      flatIntegratedTraditionalMatchesObj =
        flatIntegratedTraditionalMatchesObj.concat(match.children);
  });

  flatIntegratedTraditionalMatchesObj.forEach((match) => {
    if (match.integrated) {
      const existingIntegrated_NEntry = integratedInterProN_Map.get(
        match.integrated,
      );

      if (existingIntegrated_NEntry) {
        // Find the corresponding N-match and push the traditional next to it
        const siblingMatchIndex = existingIntegrated_NEntry.children?.findIndex(
          (elem) => {
            const processedAccession = elem.accession.replace(':nMatch', '');
            if (processedAccession === match.accession) {
              return true;
            }
            return false;
          },
        );
        if (siblingMatchIndex !== undefined && siblingMatchIndex >= 0) {
          existingIntegrated_NEntry.children?.splice(
            siblingMatchIndex + 1,
            0,
            match,
          );
        } else {
          existingIntegrated_NEntry.children?.push(match);
        }

        integratedInterProN_Map.set(
          match.integrated,
          existingIntegrated_NEntry,
        );
      }
    }
  });

  // Add representative data
  const representativeData = processRepresentativeData(
    flatIntegratedTraditionalMatchesObj.concat(
      unintegratedTraditionalMatchesObj,
    ),
  );

  return Array.from(integratedInterProN_Map.values()).concat(
    Object.values(unintegratedInterProN_MatchesMap).concat(representativeData),
  );
}
/* #### END INTEPRO_N FUNCTIONS #### */

// Match type to display logic
export function mergeMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InterProN_Match>,
  matchTypeSettings: MatchTypeUISettings,
): MinimalFeature[] {
  switch (matchTypeSettings) {
    case 'hmm':
      return traditionalMatches;
    case 'dl':
      return processInterProN_Matches(
        type,
        interproNMatches,
        'n-only',
      ) as MinimalFeature[];
    case 'best':
      return chooseBestMatch(type, traditionalMatches, interproNMatches);
    case 'hmm_and_dl':
      return combineMatches(
        type,
        traditionalMatches,
        interproNMatches,
      ) as MinimalFeature[];
    default:
      return [];
  }
}
