import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'src/components/ProteinViewer/utils';

import { sortTracks } from './DomainsOnProteinLoaded/utils';

export const orderByAccession = (
  a: { accession: string },
  b: { accession: string },
) => (a.accession > b.accession ? 1 : -1);

export const groupByEntryType = (
  interpro: Array<{
    accession: string;
    type: string;
  }>,
) => {
  const groups: Record<
    string,
    Array<{
      accession: string;
      type: string;
    }>
  > = {};
  for (const entry of interpro) {
    if (!groups[entry.type]) groups[entry.type] = [];
    groups[entry.type].push(entry);
  }
  Object.values(groups).forEach((g) => g.sort(orderByAccession));
  return groups;
};

// Protein Viewer reorganization functions
export const getFeature = (
  filter: string | string[],
  mergedData: ProteinViewerDataObject,
): ExtendedFeature[] => {
  if (mergedData['other_features']) {
    return (mergedData['other_features'] as ExtendedFeature[]).filter(
      (entry) => {
        const entryDB = entry.source_database?.toLowerCase();
        if (entryDB) {
          if (Array.isArray(filter))
            return filter.some((item) => entryDB.includes(item));
          else return filter.includes(entryDB);
        }
      },
    );
  }
  return [];
};

export const filterMobiDBLiteFeatures = (
  mergedData: ProteinViewerDataObject,
): ExtendedFeature[] => {
  const mobiDBLiteEntries: ExtendedFeature[] = (
    mergedData['other_features'] as ExtendedFeature[]
  ).filter((k) =>
    (k as ExtendedFeature).accession.toLowerCase().includes('mobidb'),
  );

  const mobiDBLiteConsensusWithChildren: ExtendedFeature[] =
    mobiDBLiteEntries.filter(
      (entry) =>
        entry.accession.toLowerCase().includes('consensus') ||
        entry.name?.toLowerCase().includes('consensus'),
    );

  const mobiDBLiteChildren: ExtendedFeature[] = mobiDBLiteEntries.filter(
    (entry) =>
      !entry.accession.toLowerCase().includes('consensus') &&
      !entry.name?.toLowerCase().includes('consensus'),
  );

  if (mobiDBLiteConsensusWithChildren.length > 0) {
    mobiDBLiteChildren.map((child) => {
      child.protein = child.accession;
    });
    mobiDBLiteConsensusWithChildren[0].children = mobiDBLiteChildren;
  }

  return mobiDBLiteConsensusWithChildren;
};

export const sectionsReorganization = (
  mergedData: ProteinViewerDataObject,
): ProteinViewerDataObject<MinimalFeature> => {
  const newData = {
    ...(mergedData as ProteinViewerDataObject<MinimalFeature>),
  };

  const toMove: Record<string, string> = {
    homologous_superfamily: 'domain',
    repeat: 'domain',
  };

  const toCheck = ['domain', 'family'];

  // Domain and family as empty objects, to cancat other object later
  toCheck.map((section) => {
    if (!newData[section]) newData[section] = [];
  });

  // Add certain sections to domain section
  Object.keys(toMove).map((section) => {
    if (newData[section]) {
      if (toMove[section]) {
        newData[toMove[section]] = newData[toMove[section]].concat(
          newData[section],
        );
      }
    }
    newData[section] = [];
  });

  return newData;
};

export const proteinViewerReorganization = (
  dataFeatures: RequestedData<ExtraFeaturesPayload> | undefined,
  dataMerged: ProteinViewerDataObject,
  iprscan: boolean,
): ProteinViewerDataObject => {
  // Create PTMs data section
  if (
    (dataFeatures && !dataFeatures.loading && dataFeatures.payload) ||
    dataMerged['other_features']
  ) {
    dataMerged['intrinsically_disordered_regions'] = filterMobiDBLiteFeatures(
      dataMerged,
    ) as MinimalFeature[];
  }

  // Splitting the "other features" section in mulitple subsets.
  // Using this logic we can go back to having the "other_features" section again.
  const CPST = ['coils', 'phobius', 'signalp', 'tmhmm'];
  dataMerged['coiled-coils,_signal_peptides,_transmembrane_regions'] =
    getFeature(CPST, dataMerged) as MinimalFeature[];
  dataMerged['pfam-n'] = getFeature('pfam-n', dataMerged) as MinimalFeature[];
  dataMerged['short_linear_motifs'] = getFeature(
    'elm',
    dataMerged,
  ) as MinimalFeature[];
  dataMerged['funfam'] = getFeature('funfam', dataMerged) as MinimalFeature[];
  dataMerged['cath-funfam'] = getFeature(
    'cath-funfam',
    dataMerged,
  ) as MinimalFeature[];

  if (Object.keys(dataMerged).includes('region')) {
    dataMerged['spurious_proteins'] = dataMerged['region'];
    delete dataMerged['region'];
  }

  // Filter the types above out of the "other_features" section
  const toRemove = CPST.concat([
    'pfam-n',
    'short_linear_motifs',
    'mobidblt',
    'funfam',
    'cath-funfam',
    'elm',
  ]);

  if (dataMerged['other_features']) {
    dataMerged['other_features'] = dataMerged['other_features'].filter(
      (entry) => {
        return !toRemove.some(
          (item) => (entry as ExtendedFeature).source_database?.includes(item),
        );
      },
    );
  }

  const uniqueResidues: Record<string, ExtendedFeature> = {};
  const accessionAndDescriptionGroupedRedidues: Record<
    string,
    ExtendedFeature
  > = {};

  // Group PIRSR residue by description and position
  let pirsrFound = false;
  for (let i = 0; i < dataMerged.residues?.length; i++) {
    const currentResidue = dataMerged.residues[i] as ExtendedFeature;
    if (currentResidue.source_database === 'pirsr') {
      currentResidue.accession = currentResidue.accession.replace(
        'residue:',
        '',
      );
      if (!pirsrFound) pirsrFound = true;
      const residueStart =
        currentResidue.locations?.[0].fragments?.[0].start || 0;
      const residueEnd = currentResidue.locations?.[0].fragments?.[0].end || 0;
      const residueDescription =
        currentResidue.locations?.[0].description?.replace('.', '');

      const dictKey =
        residueStart.toString() + residueEnd.toString() + residueDescription;

      if (!uniqueResidues[dictKey]) uniqueResidues[dictKey] = currentResidue;
    } else {
      /*
        Results coming in from InterProScan 5 are splitted. We get a residue object for each "location" match.
        Normally we'd have a single residue object with multiple locations matches in the "locations" attribute.
        The following logic is to group residues in a single object based on accession and the sites' description.
      */

      if (iprscan) {
        const currentResidueLocations = currentResidue.residues?.[0].locations;
        const currentResidueFragments = currentResidue.locations?.[0].fragments;

        if (currentResidueLocations && currentResidueFragments) {
          // Residue with that accession already added
          if (
            accessionAndDescriptionGroupedRedidues[currentResidue.accession]
          ) {
            // Residue with that accession already has locations with that description
            const existingResidue =
              accessionAndDescriptionGroupedRedidues[currentResidue.accession];
            const existingResidueLocations =
              existingResidue.residues?.[0].locations;
            const existingDescriptionIndex =
              existingResidueLocations?.findIndex(
                (location) =>
                  location.description ===
                  currentResidueLocations?.[0].description,
              );

            if (
              existingResidueLocations &&
              existingDescriptionIndex !== undefined &&
              existingDescriptionIndex >= 0
            ) {
              existingResidueLocations[existingDescriptionIndex].fragments =
                existingResidueLocations[
                  existingDescriptionIndex
                ].fragments.concat(currentResidueLocations?.[0].fragments);
              existingResidue.locations?.[0].fragments.push(
                currentResidueFragments?.[0],
              );
            }
          }

          // Residue with that accession doesn't exist
          else {
            accessionAndDescriptionGroupedRedidues[currentResidue.accession] =
              currentResidue;
          }
        }
      }

      // Normal results coming from InterPro DB
      else {
        uniqueResidues[currentResidue.accession] = currentResidue;
      }
    }

    // Add to uniqueResidues if iprscan
    if (iprscan) {
      Object.values(accessionAndDescriptionGroupedRedidues).forEach(
        (residue) => {
          uniqueResidues[residue.accession] = residue;
        },
      );
    }
  }

  // Create fake PIRSR object to display group label
  if (pirsrFound)
    uniqueResidues['PIRSR'] = {
      accession: 'PIRSR_GROUP',
      source_database: 'pirsr',
      type: 'residue',
      locations: [
        {
          description: 'PIRSR',
          fragments: [{ residues: '', start: -10, end: 0 }],
        } as ExtendedFeatureLocation,
      ],
    };

  dataMerged.residues = Object.values(uniqueResidues).sort((a, b) => {
    // If comparing two entries from different DBs, put the non-pirsr always first (a) OR if source database is pirsr and first element is fake label, put fake label first
    if (
      (a.source_database !== 'pirsr' && b.source_database === 'pirsr') ||
      (a.source_database === b.source_database && a.accession === 'PIRSR_GROUP')
    )
      return -1;
    // If comparing two entries from different DBs, put the non-pirsr always first (b) OR if source database is pirsr and second element is fake label, put fake label first
    else if (
      (a.source_database === 'pirsr' && b.source_database !== 'pirsr') ||
      (a.source_database === b.source_database && b.accession === 'PIRSR_GROUP')
    )
      return 1;
    // All other cases
    else return a.accession.localeCompare(b.accession);
  });

  return { ...dataMerged };
};

export const dbToSection: Record<string, string> = {
  cathgene3d: 'homologous_superfamily',
  cdd: 'domain',
  hamap: 'family',
  panther: 'family',
  pirsf: 'family',
  pirsr: 'residues',
  sfld: 'family',
  smart: 'domain',
  sff: 'homologous_superfamily',
};
