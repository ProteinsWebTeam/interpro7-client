import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'components/ProteinViewer/utils';

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

export const standardizeResidueStructure = (
  residues: Array<ExtendedFeature>,
): Array<ExtendedFeature> => {
  const newResidues: Array<ExtendedFeature> = [];
  residues.map((residueParentObj) => {
    const tempResidue: ExtendedFeature = residueParentObj;
    tempResidue.type = 'residue';
    tempResidue.locations = residueParentObj.residues?.[0].locations;
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

function processInterPro_NMatches(
  type: string,
  interpro_NMatches: Record<string, IntePro_NMatch>,
  bestMode: boolean,
):
  | MinimalFeature[]
  | [MinimalFeature[], Map<string, ExtendedFeature>, string[]] {
  let processedInterPro_NMatches: MinimalFeature[] = [];

  // Get deep copy of unintegrated entries
  const baseNMatchesObjUnintegrated = JSON.parse(
    JSON.stringify(
      Object.values(interpro_NMatches).filter((match: IntePro_NMatch) => {
        return (
          !match.integrated &&
          match.type === type &&
          (bestMode ? match.is_preferred : true)
        );
      }),
    ),
  );

  // Get deep copy of integrated entries
  const baseNMatchesObjIntegrated = JSON.parse(
    JSON.stringify(
      Object.values(interpro_NMatches).filter((match: IntePro_NMatch) => {
        return (
          match.integrated &&
          match.type === type &&
          (bestMode ? match.is_preferred : true)
        );
      }),
    ),
  );

  // Create map <integrated_accession: integrated_entryobj> to append integrated matches as children later
  let integratedMap: Map<string, ExtendedFeature> = new Map();
  if (baseNMatchesObjIntegrated.length > 0) {
    baseNMatchesObjIntegrated.map(
      (entry: { integrated?: { accession: string } }) => {
        integratedMap.set(
          entry.integrated?.accession as string,
          entry.integrated as ExtendedFeature,
        );
      },
    );
  }

  if (integratedMap) {
    for (let i = 0; i < baseNMatchesObjIntegrated.length; i++) {
      // Edit base match entry obj so that the integrated field is just the integrated accession and not the whole entry
      const tempNMatch = { ...baseNMatchesObjIntegrated[i] };
      const integratedAccession: string = tempNMatch.integrated.accession;
      tempNMatch.integrated = integratedAccession;

      // Append that new match object to the children list of the integrated "parent" entry
      const interproMapEntry: ExtendedFeature | null =
        integratedMap.get(integratedAccession) || null;

      if (interproMapEntry) {
        interproMapEntry.entry_protein_locations =
          tempNMatch.entry_protein_locations;
        integratedMap.set(integratedAccession, interproMapEntry);
        if (interproMapEntry?.children) {
          interproMapEntry.children.push(tempNMatch);
          integratedMap.set(integratedAccession, interproMapEntry);
        } else {
          interproMapEntry.children = [tempNMatch];
          integratedMap.set(integratedAccession, interproMapEntry);
        }
      }
    }
  }

  // Merge unintegrated and integrated
  processedInterPro_NMatches = baseNMatchesObjUnintegrated.concat(
    Array.from(integratedMap.values()),
  );
  if (bestMode) {
    const bestMatches = Object.entries(interpro_NMatches).filter(
      (match) => match[1].is_preferred && type == match[1].type,
    );
    return [
      baseNMatchesObjUnintegrated,
      integratedMap,
      bestMatches.map((match) => match[0] /*accession*/),
    ];
  }
  return processedInterPro_NMatches;
}

function chooseBestMatch(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, IntePro_NMatch>,
): MinimalFeature[] {
  const processingResult = processInterPro_NMatches(
    type,
    interproNMatches,
    true,
  );
  const bestMatchesList = processingResult[2] as string[];
  let processedUnintegratedInterPro_NMatches = JSON.parse(
    JSON.stringify(processingResult[0]),
  ) as MinimalFeature[];
  let processedIntegratedMapInterPro_NMatches: Map<string, ExtendedFeature> =
    processingResult[1] as Map<string, ExtendedFeature>;

  const baseMatchesObjUnintegrated = JSON.parse(
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

  // TODO: combine integrated matches
  // - Flatten object of traditional matches
  // - if match is in the bestMatches list, avoid it
  // - if match is not in the bestMatches list and the Interpro integrated accession is in the map, append to children
  // - if match is not in the best matches and the intepro integrated accession is NOT in the matp, create map entry (reuse logic of processing function)

  return JSON.parse(
    JSON.stringify(
      processedUnintegratedInterPro_NMatches.concat(baseMatchesObjUnintegrated),
    ),
  );
}

// InterPro-N matches handling logic
export function mergeMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, IntePro_NMatch>,
  matchTypeSettings: MatchTypeUISettings,
  colorDomainsBy: string,
): MinimalFeature[] {
  switch (matchTypeSettings) {
    case 'hmm':
      return JSON.parse(JSON.stringify(traditionalMatches));
    case 'dl':
      return processInterPro_NMatches(
        type,
        interproNMatches,
        false,
      ) as MinimalFeature[];
    case 'best':
      return chooseBestMatch(type, traditionalMatches, interproNMatches);
    case 'hmm_and_dl':
      return [];
    default:
      return [];
  }
}
