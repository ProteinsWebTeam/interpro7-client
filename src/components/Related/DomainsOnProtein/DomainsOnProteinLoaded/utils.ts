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

const typeToSection: Record<string, string> = {
  homologous_superfamily: 'domain',
  repeat: 'domain',
};

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

  if (aAccession && (aAccession as string).startsWith('TED:')) return -1;
  if (bAccession && (bAccession as string).startsWith('TED:')) return 1;
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

/* #### SUPPORT FUNCTIONS #### */
function isInterProN(
  matches: ExtendedFeature[] | InterProN_Match[],
): matches is InterProN_Match[] {
  return true;
}

const processRepresentativeData = (
  matches: ExtendedFeature[] | InterProN_Match[],
  type: string,
): ExtendedFeature[] => {
  // Representative data logic
  let representativeData: { accession: string | unknown }[] = [];

  if (type == 'domain') {
    const representativeDomains = selectRepresentativeData(
      matches,
      'entry_protein_locations',
      'domain',
    );

    representativeDomains.forEach((domain) => {
      if (domain.integrated)
        domain.integrated = (domain.integrated as ExtendedFeature).accession;
    });

    representativeData = representativeDomains;
  } else if (type == 'family') {
    const representativeFamilies = selectRepresentativeData(
      matches,
      'entry_protein_locations',
      'family',
    );

    representativeFamilies.forEach((family) => {
      if (family.integrated)
        family.integrated = (family.integrated as ExtendedFeature).accession;
    });

    representativeData = representativeFamilies;
  }

  representativeData.forEach((match) => (match.accession += ':nMatch'));

  return representativeData as ExtendedFeature[];
};

const addMatchToMap = (
  matchesMap: Map<string, ExtendedFeature | InterProN_Match>,
  match: ExtendedFeature | InterProN_Match,
  type: 'unintegrated' | 'integrated',
): Map<string, ExtendedFeature | InterProN_Match> => {
  const accession =
    type === 'unintegrated'
      ? match.accession
      : (match as ExtendedFeature).integrated;

  let existingEntry = null;
  if (accession) existingEntry = matchesMap.get(accession);

  if (accession && existingEntry) {
    const siblingMatchIndex = existingEntry.children?.findIndex((elem) => {
      const processedAccession = elem.accession.replace(':nMatch', '');
      if (processedAccession === match.accession) {
        return true;
      }
      return false;
    });
    if (siblingMatchIndex !== undefined && siblingMatchIndex >= 0) {
      existingEntry.children?.splice(
        siblingMatchIndex,
        0,
        match as { accession: string; source_database: string },
      );
    } else {
      existingEntry.children?.push(
        match as { accession: string; source_database: string },
      );
    }
    matchesMap.set(accession, existingEntry);
  }
  return matchesMap;
};

const unintegratedTradMatchFilter = (type: string, match: ExtendedFeature) => {
  return (
    (match.type && typeToSection[match.type] // Homologous superfamilies and repeats
      ? typeToSection[match.type] === type
      : match.type === type) && // Match section
    !match.accession.startsWith('IPR') // Not integrated
  );
};

const integratedTradMatchFilter = (type: string, match: ExtendedFeature) => {
  return (
    (match.type && typeToSection[match.type] // Homologous superfamilies and repeats
      ? typeToSection[match.type] === type
      : match.type === type) && // Match section
    match.accession.startsWith('IPR') // Is integrated
  );
};

const unintegratedN_MatchFilter = (
  type: string,
  mode: string,
  match: InterProN_Match,
) => {
  return (
    !match.integrated && // Not integrated
    (typeToSection[match.type] // Homologous superfamilies and repeats
      ? typeToSection[match.type] === type
      : match.type === type) && // Match section
    (mode === 'best' ? match.is_preferred : true)
  ); // If we're in best mode, take only the preferred ones
};

const integratedN_MatchFilter = (
  type: string,
  mode: string,
  match: InterProN_Match,
) => {
  // Get type of parent entry
  let integratedType = undefined;
  if (match.integrated)
    integratedType = (match.integrated as ExtendedFeature).type;

  return (
    match.integrated &&
    integratedType && // Base condition
    (typeToSection[match.type] // Homologous superfamilies and repeats
      ? typeToSection[match.type] === type ||
        typeToSection[integratedType] == type
      : match.type === type || // Match section for match or integrated entry
        integratedType == type) &&
    (mode === 'best' ? match.is_preferred : true)
  ); // If we're in best mode, take only the preferred ones
};

const addSuffix = (matches: InterProN_Match[]) => {
  const newMatches = JSON.parse(JSON.stringify(matches));
  newMatches.forEach((match: MinimalFeature) => {
    match.accession = match.accession + ':nMatch';
  });
  return newMatches;
};

type InterProProcessedResult = Record<
  string,
  InterProN_Match[] | Map<string, InterProN_Match> | string[]
>;
/* #### END SUPPORT FUNCTIONS #### */

/* #### INTEPRO_N FUNCTIONS #### */
function processInterProN_Matches(
  type: string,
  interproN_Matches: Record<string, InterProN_Match>,
  mode: string,
): ExtendedFeature[] | InterProProcessedResult {
  // Get deep copy of unintegrated entries and add suffix to distinguish them in PV
  let unintegratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InterProN_Match) => {
        return unintegratedN_MatchFilter(type, mode, match);
      }),
    ),
  );
  unintegratedInterProN_Matches = addSuffix(unintegratedInterProN_Matches);

  // Get deep copy of integrated entries and add suffix to distinguish them in PV
  let integratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InterProN_Match) => {
        return integratedN_MatchFilter(type, mode, match);
      }),
    ),
  );
  integratedInterProN_Matches = addSuffix(integratedInterProN_Matches);

  /*
  Create map <integrated_accession: integrated_entryobj> to append integrated matches as children later
   NOTE: see structure of returned InterPro-N objects
  (it's a dict, where matches accessions are keys, values then contain the integrated entry as another dict)
  */
  let integratedInterProN_Map: Map<string, InterProN_Match> = new Map();
  if (integratedInterProN_Matches.length > 0) {
    integratedInterProN_Matches.forEach(
      (entry: { integrated?: { accession: string } }) => {
        integratedInterProN_Map.set(
          entry.integrated?.accession as string,
          entry.integrated as InterProN_Match,
        );
      },
    );
  }

  // Append integrated matches as matches of the InterPro entries set int the Map mentioned and defined above
  if (integratedInterProN_Map) {
    for (let i = 0; i < integratedInterProN_Matches.length; i++) {
      // Edit base match entry obj so that the integrated field is just the integrated accession and not the whole entry
      const tempInterproN_Match = { ...integratedInterProN_Matches[i] };
      const integratedAccession: string =
        tempInterproN_Match.integrated.accession;
      tempInterproN_Match.integrated = integratedAccession;

      // Append that new match object to the children list of the integrated "parent" entry
      const interproMapEntry: InterProN_Match | null =
        integratedInterProN_Map.get(integratedAccession) || null;

      if (interproMapEntry) {
        interproMapEntry.entry_protein_locations =
          tempInterproN_Match.entry_protein_locations;
        interproMapEntry.accession = interproMapEntry.accession;
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
  let processedInterProN_Matches: ExtendedFeature[] = [];
  processedInterProN_Matches = unintegratedInterProN_Matches.concat(
    Array.from(integratedInterProN_Map.values()),
  );

  // Add representative data, filtering only by type
  const representativeData = processRepresentativeData(
    Object.values(interproN_Matches),
    type,
  );

  /*
  Depending on which mode is selected, we need to return different objects
    - Only InterPro-N, "dl": simply return the merged unintegrated, integrated and representative data
    - Default mode, "best": return a record with the map of the integrated, the array of unintegrated and the list of best matches
    - Stacked mode, "hmm_and_dl": return a record with the map of the integrated and the array of unintegrated
  */
  switch (mode) {
    case 'dl':
      let fullData: ExtendedFeature[] =
        processedInterProN_Matches.concat(representativeData);

      // Handle edge-case where match type is different from the one of it parent InterPro entry
      fullData = fullData.filter((match) => {
        return !(
          match.type !== type &&
          match.type &&
          typeToSection[match.type] !== type
        );
      });
      return fullData;

    case 'best':
      const bestUnintegratedMatches = unintegratedInterProN_Matches.map(
        (match: InterProN_Match) => match.accession,
      );
      const bestIntegratedMatches = integratedInterProN_Matches.map(
        (match: InterProN_Match) => match.accession,
      );
      const bestMatches = bestUnintegratedMatches.concat(bestIntegratedMatches);
      return {
        best_matches: bestMatches,
        unintegratedArray: unintegratedInterProN_Matches,
        integratedMap: integratedInterProN_Map,
      };

    case 'hmm_and_dl':
      return {
        unintegratedArray: unintegratedInterProN_Matches as InterProN_Match[],
        integratedMap: integratedInterProN_Map,
      };
    default:
      return [];
  }
}

function combineMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproN_Matches: Record<string, InterProN_Match>,
): ExtendedFeature[] {
  // Get map of Interpro-N matches
  const processedResult = processInterProN_Matches(
    type,
    interproN_Matches,
    'hmm_and_dl',
  ) as InterProProcessedResult;

  const unintegratedInterProN_Matches = processedResult[
    'unintegratedArray'
  ] as InterProN_Match[];
  let unintegratedInterProN_MatchesMap: Map<
    string,
    ExtendedFeature | InterProN_Match
  > = new Map();

  /*
    Build initial structure for unintegrated entries starting from InterPro-N ones.
    We're going to have a parentUnintegrated entry where all the unintegrated entries (HMMs and DLs)
    with the same accessionare going to fall.
  */
  unintegratedInterProN_Matches.forEach((match) => {
    const newMatch: InterProN_Match = JSON.parse(JSON.stringify(match));
    const baseAccession = newMatch.accession.replace(':nMatch', '');
    unintegratedInterProN_MatchesMap.set(baseAccession, {
      accession: 'parentUnintegrated:' + baseAccession,
      locations: (match as InterProN_Match).entry_protein_locations,
      source_database: match.source_database,
      children: [newMatch as { accession: string; source_database: string }],
    });
  });

  // Take unintegrated traditional matches and apply appropriate filters
  const unintegratedTraditionalMatchesObj: ExtendedFeature[] =
    traditionalMatches.filter((match: ExtendedFeature) => {
      return unintegratedTradMatchFilter(type, match);
    });

  // Combine unintegrated traditional matches from InterPro-N and HMMs under the same "parentUnintegrated" parent element
  unintegratedTraditionalMatchesObj.forEach((match) => {
    const newMatch = JSON.parse(JSON.stringify(match));
    const baseAccession = match.accession.replace(':nMatch', '');

    if (unintegratedInterProN_MatchesMap.get(match.accession)) {
      // Find the corresponding N-match and push the traditional next to it
      unintegratedInterProN_MatchesMap = addMatchToMap(
        unintegratedInterProN_MatchesMap,
        match,
        'unintegrated',
      );

      // If there's no corresponding InterPro-N match, then create a new parentUnintegratedEntry
    } else {
      unintegratedInterProN_MatchesMap.set(baseAccession, {
        accession: 'parentUnintegrated:' + baseAccession,
        locations: (match as InterProN_Match).entry_protein_locations,
        source_database: match.source_database,
        children: [newMatch as { accession: string; source_database: string }],
      });
    }
  });

  /*
    Now we're going to to the same thing for integrated entries.
    Build initial structure for integrated entries starting from InterPro-N ones.
    We're going to have a parent InterPro entry where all the integrated entries (HMMs and DLs)
    with the same accession are going to fall.
  */

  // Integrated matches processing logic: combine integrated matches from InterPro-N and HMMs under the same InterPro entry parent element
  let integratedInterProN_Map = processedResult['integratedMap'] as Map<
    string,
    InterProN_Match
  >;
  let integratedInterPro_NMatches = Array.from(
    integratedInterProN_Map.values(),
  );

  let flatIntegratedTraditionalMatchesObj: ExtendedFeature[] = [];

  let integratedTraditionalMatchesObj: ExtendedFeature[] =
    traditionalMatches.filter((match: ExtendedFeature) => {
      return integratedTradMatchFilter(type, match);
    });

  // Flatten elements
  integratedTraditionalMatchesObj.forEach((match) => {
    if (match.children)
      flatIntegratedTraditionalMatchesObj =
        flatIntegratedTraditionalMatchesObj.concat(match.children);
  });

  // Combine integrated traditional matches from InterPro-N and HMMs under the same InterPro entry parent element
  flatIntegratedTraditionalMatchesObj.forEach((match) => {
    if (match.integrated) {
      const existingIntegrated_NEntry = integratedInterProN_Map.get(
        match.integrated,
      );

      if (existingIntegrated_NEntry) {
        // Remove from traditional matches the ones that have a corresponding integrated Interpro-N match
        integratedTraditionalMatchesObj =
          integratedTraditionalMatchesObj.filter(
            (integratedMatch) => integratedMatch.accession !== match.integrated,
          );
        integratedInterProN_Map = addMatchToMap(
          integratedInterProN_Map,
          match,
          'integrated',
        ) as Map<string, InterProN_Match>;
      }
    }
  });

  /*
    Logic to add representative data
    Take representativa data from traditional matches first.
    If it's not available, then show the traditional data from InterPro-N
  */
  const representativeTraditionalData = traditionalMatches.filter(
    (match: ExtendedFeature) => match.representative,
  );

  // Flatten InterPro-N integrated
  let flatIntegratedInterProN_Matches: ExtendedFeature[] = [];
  integratedInterPro_NMatches.forEach((match) => {
    if (match.children)
      flatIntegratedInterProN_Matches = flatIntegratedInterProN_Matches.concat(
        match.children,
      );
  });

  const nMatchesFullData = flatIntegratedInterProN_Matches.concat(
    unintegratedInterProN_Matches as ExtendedFeature[],
  );
  const nMatchesRepresentativeData = processRepresentativeData(
    nMatchesFullData,
    type,
  );
  let representativeData =
    representativeTraditionalData.length > 0
      ? representativeTraditionalData
      : nMatchesRepresentativeData;

  /* Return results concatenating processed objects */
  const processedIntegratedN_Matches = Array.from(
    integratedInterProN_Map.values(),
  );
  const processedUnintegratedMatches = Array.from(
    unintegratedInterProN_MatchesMap.values(),
  );

  // Handle edge-case where match type is different from the one of it parent InterPro entry
  let allIntegratedMatches = integratedTraditionalMatchesObj.concat(
    processedIntegratedN_Matches as ExtendedFeature[],
  );

  allIntegratedMatches = allIntegratedMatches.filter((match) => {
    return !(
      match.type !== type &&
      match.type &&
      typeToSection[match.type] !== type
    );
  });

  return processedUnintegratedMatches
    .concat(allIntegratedMatches)
    .concat(representativeData as ExtendedFeature[]) as ExtendedFeature[];
}

function chooseBestMatch(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InterProN_Match>,
): ExtendedFeature[] {
  const processedResult = processInterProN_Matches(
    type,
    interproNMatches,
    'best',
  ) as InterProProcessedResult;

  // Best unintegrated InterPro-N matches
  let processedUnintegratedInterProN_Matches: InterProN_Match[] =
    processedResult['unintegratedArray'] as InterProN_Match[];

  // Map with best integrated InterPro-N matches
  let processedIntegratedMapInterPro_NMatches = processedResult[
    'integratedMap'
  ] as Map<string, ExtendedFeature>;

  let flatIntegratedInterProN_Matches: ExtendedFeature[] = [];
  processedIntegratedMapInterPro_NMatches.forEach((match) => {
    if (match.children)
      flatIntegratedInterProN_Matches = flatIntegratedInterProN_Matches.concat(
        match.children,
      );
  });
  // List of best matches (unintegrated and integrated)
  let bestMatchesList = processedResult['best_matches'] as string[];
  bestMatchesList = bestMatchesList.map((match) =>
    match.replaceAll(':nMatch', ''),
  );

  // Retrieve traditional unintegrated matches that were not already in the InterproN matches and choosen as the preferred
  const baseMatchesObjUnintegrated: ExtendedFeature[] =
    traditionalMatches.filter((match: ExtendedFeature) => {
      return (
        unintegratedTradMatchFilter(type, match) &&
        !bestMatchesList.includes(match.accession)
      );
    }) as ExtendedFeature[];

  // Retrieve traditional integrated matches that were not alredy in the InterproN matches and choosen as the preferred
  const baseMatchesObjIntegrated: ExtendedFeature[] = traditionalMatches.filter(
    (match: ExtendedFeature) => {
      return integratedTradMatchFilter(type, match);
    },
  ) as ExtendedFeature[];

  /*  Rebuild integrated matches structure (including children), appending matches to already existing preferred Intepro-N matches or traditional matches.
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

  /*
  Logic to add representative data
  Take representativa data from traditional matches first.
  If it's not available, then show the traditional data from InterPro-N
  */
  const representativeTraditionalData = traditionalMatches.filter(
    (match: ExtendedFeature) => match.representative,
  );

  const nMatchesFullData = flatIntegratedInterProN_Matches.concat(
    processedUnintegratedInterProN_Matches as ExtendedFeature[],
  );
  const nMatchesRepresentativeData = processRepresentativeData(
    nMatchesFullData,
    type,
  );
  let representativeData =
    representativeTraditionalData.length > 0
      ? representativeTraditionalData
      : nMatchesRepresentativeData;
  const representativeAccessions = representativeData.map(
    (repr) => repr.accession,
  );

  // Handle edge-case where match type is different from the one of it parent InterPro entry
  let allIntegratedMatches = (
    processedUnintegratedInterProN_Matches as ExtendedFeature[]
  )
    .concat(
      Array.from(
        processedIntegratedMapInterPro_NMatches.values(),
      ) as ExtendedFeature[],
    )
    .concat(baseMatchesObjUnintegrated as ExtendedFeature[]);

  allIntegratedMatches = allIntegratedMatches.filter((match) => {
    return (
      !(
        match.type !== type &&
        match.type &&
        typeToSection[match.type] !== type
      ) ||
      match.children?.some((child) =>
        representativeAccessions.includes(child.accession),
      )
    );
  });

  return allIntegratedMatches.concat(
    representativeData as ExtendedFeature[],
  ) as ExtendedFeature[];
}

/* #### END INTEPRO_N FUNCTIONS #### */

// Match type to display logic
export function mergeMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InterProN_Match>,
  matchTypeSettings: MatchTypeUISettings,
): ExtendedFeature[] {
  switch (matchTypeSettings) {
    case 'hmm':
      return traditionalMatches;
    case 'dl':
      return processInterProN_Matches(
        type,
        interproNMatches,
        matchTypeSettings,
      ) as ExtendedFeature[];
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

export const moveExternalFeatures = (data: ProteinViewerDataObject) => {
  data['external_sources'] = (
    data['external_sources'] as MinimalFeature[]
  ).filter((feature: MinimalFeature) => {
    if (feature.source_database === 'DisProt') {
      data['intrinsically_disordered_regions'].push(feature);
      return false;
    } else if (
      feature.source_database === 'RepeatsDB' ||
      feature.source_database === 'TED'
    ) {
      data['domain'].push(feature);
      return false;
    }

    return true;
  });
};
