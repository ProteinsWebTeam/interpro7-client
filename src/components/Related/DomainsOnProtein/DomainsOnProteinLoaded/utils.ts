import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'components/ProteinViewer/utils';

/// UTILS
export const UNDERSCORE = /_/g;

const FIRST_IN_ORDER = [
  'alphafold_confidence',
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
  residues.map((residueParentObj) => {
    const tempResidue: ExtendedFeature = residueParentObj;
    tempResidue.type = 'residue';
    tempResidue.locations =
      residueParentObj.residues?.[0].locations || tempResidue.locations;
    newResidues.push(tempResidue);
  });
  return newResidues;
};

export const standardizeMobiDBFeatureStructure = (
  features: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newFeatures: Array<ExtendedFeature> = [];
  features.map((feature) => {
    const tempFeature = { ...feature };
    const slicedTempFeatureLocations: Array<ExtendedFeatureLocation> = [];
    tempFeature.accession = 'Mobidblt-Consensus Disorder Prediction';
    tempFeature.source_database = 'mobidblt';
    tempFeature.protein = '';
    tempFeature.locations?.map(
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
            const restructuredLocation: ExtendedFeatureLocation[] = [
              {
                fragments: [
                  {
                    start: location.start,
                    end: location.end,
                    seq_feature: location['sequence-feature'],
                  },
                ],
              },
            ];

            const tempChild: ExtendedFeature = {
              accession: location['sequence-feature'],
              source_database: 'mobidblt',
              locations: restructuredLocation,
            };
            tempFeature.children?.push(tempChild);
          }
        } else {
          slicedTempFeatureLocations.push(location);
        }
      },
    );
    tempFeature.locations = slicedTempFeatureLocations;
    newFeatures.push(tempFeature);
  });

  return newFeatures;
};
/* #### END STANDARDIZATION FUNCTIONS #### */

/* #### INTEPRO_N FUNCTIONS #### */

function processInterProN_Matches(
  type: string,
  interproN_Matches: Record<string, InteProN_Match>,
  bestMode: boolean,
):
  | MinimalFeature[]
  | [MinimalFeature[], Map<string, ExtendedFeature>, string[]] {
  let processedInterProN_Matches: MinimalFeature[] = [];

  // Get deep copy of unintegrated entries
  const unintegratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InteProN_Match) => {
        return (
          !match.integrated &&
          match.type === type &&
          (bestMode ? match.is_preferred : true)
        );
      }),
    ),
  );

  unintegratedInterProN_Matches.map((match: MinimalFeature) => {
    match.accession = match.accession + ':nMatch';
  });

  // Get deep copy of integrated entries
  const integratedInterProN_Matches = JSON.parse(
    JSON.stringify(
      Object.values(interproN_Matches).filter((match: InteProN_Match) => {
        return (
          match.integrated &&
          match.type === type &&
          (bestMode ? match.is_preferred : true)
        );
      }),
    ),
  );

  integratedInterProN_Matches.map((match: MinimalFeature) => {
    match.accession = match.accession + ':nMatch';
  });

  // Create map <integrated_accession: integrated_entryobj> to append integrated matches as children later
  let integratedInterProN_Map: Map<string, ExtendedFeature> = new Map();
  if (integratedInterProN_Matches.length > 0) {
    integratedInterProN_Matches.map(
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

  // In best mode, return the unintegrated, the map with the integrated that are preferred and a list of already seen match accessions (see choseBest function below)
  if (bestMode) {
    const bestMatches = Object.entries(interproN_Matches).filter(
      (match) => match[1].is_preferred && type == match[1].type,
    );

    return [
      unintegratedInterProN_Matches,
      integratedInterProN_Map,
      bestMatches.map((match) => match[0]),
    ];
  }
  return processedInterProN_Matches;
}

function chooseBestMatch(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InteProN_Match>,
): MinimalFeature[] {
  const processingResult = processInterProN_Matches(
    type,
    interproNMatches,
    true,
  );

  // Best unintegrated matches
  let processedUnintegratedInterProN_Matches: ExtendedFeature[] = JSON.parse(
    JSON.stringify(processingResult[0]),
  ) as ExtendedFeature[];

  // Map with best integrated matches
  let processedIntegratedMapInterPro_NMatches: Map<string, ExtendedFeature> =
    processingResult[1] as Map<string, ExtendedFeature>;

  // List of best matches (unintegrated and integrated)
  const bestMatchesList = processingResult[2] as string[];

  // Retrieve traditional unintegrated matches that were not alredy in the InterproN matches and choosen as the preferred
  const baseMatchesObjUnintegrated: ExtendedFeature[] = JSON.parse(
    JSON.stringify(
      Object.values(traditionalMatches).filter((match: ExtendedFeature) => {
        return (
          match.type === type &&
          !bestMatchesList.includes(match.accession) &&
          !match.integrated &&
          !match.accession.startsWith('IPR')
        );
      }),
    ),
  );

  // Retrieve traditional integrated matches that were not alredy in the InterproN matches and choosen as the preferred
  const baseMatchesObjIntegrated: ExtendedFeature[] = JSON.parse(
    JSON.stringify(
      Object.values(traditionalMatches).filter((match: ExtendedFeature) => {
        return match.type === type && match.accession.startsWith('IPR');
      }),
    ),
  );

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

  return JSON.parse(
    JSON.stringify(
      processedUnintegratedInterProN_Matches
        .concat(baseMatchesObjUnintegrated)
        .concat(Array.from(processedIntegratedMapInterPro_NMatches.values())),
    ),
  );
}

function combineMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproN_Matches: Record<string, InteProN_Match>,
): ExtendedFeature[] {
  // Get traditional unintegrated matches
  const traditionalMatchesObj: ExtendedFeature[] = JSON.parse(
    JSON.stringify(
      Object.values(traditionalMatches).filter((match: ExtendedFeature) => {
        return match.type === type;
      }),
    ),
  );

  // Return a combination of both (properly deep-cloned)
  return JSON.parse(
    JSON.stringify(
      traditionalMatchesObj.concat(
        processInterProN_Matches(
          type,
          interproN_Matches,
          false,
        ) as MinimalFeature[],
      ),
    ),
  );
}
/* #### END INTEPRO_N FUNCTIONS #### */

// Match type to display logic
export function mergeMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, InteProN_Match>,
  matchTypeSettings: MatchTypeUISettings,
  colorDomainsBy: string,
): MinimalFeature[] {
  switch (matchTypeSettings) {
    case 'hmm':
      return JSON.parse(JSON.stringify(traditionalMatches));
    case 'dl':
      return processInterProN_Matches(
        type,
        interproNMatches,
        false,
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
