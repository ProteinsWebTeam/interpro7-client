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

// InterPro-N matches handling logic
export function mergeMatches(
  type: string,
  traditionalMatches: MinimalFeature[],
  interproNMatches: Record<string, MinimalFeature>,
  matchTypeSettings: MatchTypeUISettings,
  colorDomainsBy: string,
): MinimalFeature[] {
  // Initialize new matches data with the traditional unintegrated matches
  let mergedMatches = traditionalMatches.filter(
    (match) => !match.accession.startsWith('IPR'),
  );

  if (matchTypeSettings === 'dl') {
    // // Append unintegrated Interpro-N matches
    // let unintegratedInterProNMatches = JSON.parse(
    //   JSON.stringify(
    //     Object.values(interproNMatches).filter(
    //       (match: MinimalFeature & { integrated?: string; type?: string }) => {
    //         return (
    //           match.integrated === null && match.type == type.replace('_', ' ')
    //         );
    //       },
    //     ),
    //   ),
    // );

    // for (let i = 0; i < unintegratedInterProNMatches.length; i++) {
    //   unintegratedInterProNMatches[i].accession =
    //     unintegratedInterProNMatches[i].accession + ':nMatch';
    // }

    mergedMatches = mergedMatches.concat(
      traditionalMatches.filter((match) => match.accession.startsWith('IPR')),
    );
  }

  // // const mergedMatches = []
  // // try {
  // //   const interProMatches = traditionalMatches
  // //     .filter(entry => entry.accession.startsWith("IPR"))
  // //     .map(entry => JSON.parse(JSON.stringify(entry))); // Deep copy

  // //   for (let i = 0; i < interProMatches.length; i++) {
  // //     const interProMatchChildren: ExtendedFeature[] = [...interProMatches[i].children || []]
  // //     for (let y = 0; y < interProMatchChildren.length; y++) {

  // //       Get info from Interpro-N object
  // //       const integratedEntryAccession = interProMatchChildren[y].accession
  // //       const inteproNMatch = { ...interproNMatches[integratedEntryAccession] }

  // //       Change accessions
  // //       inteproNMatch.integrated = inteproNMatch.integrated.accession
  // //       inteproNMatch.accession += ":nMatch"

  // //       Append it to existing children
  // //       interProMatches[i].children = interProMatches[i].children.concat([inteproNMatch]);
  // //     }
  // //   }

  // //   console.log("asd", interProMatches)
  // // }
  // // catch {

  // // }

  return mergedMatches;
}
