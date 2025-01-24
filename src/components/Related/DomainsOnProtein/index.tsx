import React, { PropsWithChildren, useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { edgeCases, STATUS_TIMEOUT } from 'utils/server-message';

import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
} from 'components/AlphaFold/selectors';
import { useProcessData } from 'components/ProteinViewer/utils';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import EdgeCase from 'components/EdgeCase';

// import ConservationProvider, {
//   mergeConservationData,
//   // Disabling Conservation until hmmer is working
//   // isConservationDataAvailable,
// } from './ConservationProvider';
import mergeExtraFeatures from './mergeExtraFeatures';
import mergeResidues from './mergeResidues';
import DomainsOnProteinLoaded, { makeTracks } from './DomainsOnProteinLoaded';
import loadExternalSources, { ExtenalSourcesProps } from './ExternalSourcesHOC';
import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';
import {
  ExtendedFeature,
  ExtendedFeatureLocation,
} from 'src/components/ProteinViewer';

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

export const getFeature = (
  filter: string | string[],
  mergedData: ProteinViewerDataObject,
): ExtendedFeature[] => {
  if (mergedData['other_features']) {
    return (mergedData['other_features'] as ExtendedFeature[]).filter(
      (entry) => {
        const entryDB = entry.source_database;
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
    (k as ExtendedFeature).accession.toLowerCase().includes('mobidblt'),
  );

  const mobiDBLiteConsensusWithChildren: ExtendedFeature[] =
    mobiDBLiteEntries.filter((entry) =>
      entry.accession.toLowerCase().includes('consensus'),
    );
  const mobiDBLiteChildren: ExtendedFeature[] = mobiDBLiteEntries.filter(
    (entry) => !entry.accession.toLowerCase().includes('consensus'),
  );

  if (mobiDBLiteConsensusWithChildren.length > 0) {
    mobiDBLiteChildren.map((child) => {
      child.protein = child.accession;
    });
    mobiDBLiteConsensusWithChildren[0].children = mobiDBLiteChildren;
  }

  return mobiDBLiteConsensusWithChildren;
};

type Props = PropsWithChildren<{
  mainData: {
    metadata:
      | ProteinMetadata
      | (MinimalProteinMetadata & { name?: NameObject });
  };
  onMatchesLoaded?: (
    results: EndpointWithMatchesPayload<EntryMetadata, MatchI>[],
  ) => void;
  onFamiliesFound?: (families: Record<string, unknown>[]) => void;
  title?: string;
}>;
interface LoadedProps
  extends Props,
    ExtenalSourcesProps,
    LoadDataProps<ExtraFeaturesPayload, 'Features'>,
    LoadDataProps<ResiduesPayload, 'Residues'>,
    LoadDataProps<ProteinsAPIVariation, 'Variation'>,
    LoadDataProps<AlphafoldConfidencePayload, 'Confidence'>,
    LoadDataProps<ProteinsAPIProteomics, 'Proteomics'>,
    LoadDataProps<AlphafoldPayload, 'Prediction'>,
    LoadDataProps<
      PayloadList<EndpointWithMatchesPayload<EntryMetadata>> | ErrorPayload
    > {}

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

export const sectionsReorganization = (mergedData: ProteinViewerDataObject) => {
  // Domain and family as empty objects, to cancat other object later
  if (!mergedData.domain) {
    mergedData.domain = [];
  }

  if (!mergedData.family) {
    mergedData.family = [];
  }

  // Add repeats and homologous superfamilies to domain
  if (mergedData.homologous_superfamily) {
    mergedData.domain = mergedData.domain.concat(
      mergedData.homologous_superfamily,
    );
    mergedData.homologous_superfamily = [];
  }

  if (mergedData.repeat) {
    mergedData.domain = mergedData.domain.concat(mergedData.repeat);
    mergedData.repeat = [];
  }
};

export const proteinViewerReorganization = (
  dataFeatures: RequestedData<ExtraFeaturesPayload> | undefined,
  dataMerged: ProteinViewerDataObject,
) => {
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

  // Create a section for each of the following types
  const CPST = ['coils', 'phobius', 'signalp', 'tmhmm'];
  dataMerged['coiled-coils,_signal_peptides,_transmembrane_regions'] =
    getFeature(CPST, dataMerged) as MinimalFeature[];
  dataMerged['pfam-n'] = getFeature('pfam-n', dataMerged) as MinimalFeature[];
  dataMerged['short_linear_motifs'] = getFeature(
    'elm',
    dataMerged,
  ) as MinimalFeature[];
  dataMerged['funfam'] = getFeature('funfam', dataMerged) as MinimalFeature[];

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
      uniqueResidues[currentResidue.accession] = currentResidue;
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

  dataMerged.conserved_residues = Object.values(uniqueResidues).sort((a, b) => {
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

  if (dataMerged.domain) dataMerged.domains = dataMerged.domain.slice();

  if (dataMerged.family) dataMerged.families = dataMerged.family.slice();
};

const DomainOnProteinWithoutData = ({
  data,
  mainData,
  dataResidues,
  dataFeatures,
  dataConfidence,
  dataVariation,
  dataProteomics,
  onMatchesLoaded,
  onFamiliesFound,
  children,
  externalSourcesData,
  title,
}: LoadedProps) => {
  // const [conservation, setConservation] = useState<{
  //   generateData: boolean;
  //   showButton: boolean;
  //   data: ConservationPayload | null;
  //   error: string | null;
  // }>({
  //   generateData: false,
  //   showButton: false,
  //   data: null,
  //   error: null,
  // });
  const [processedData, setProcessedData] = useState<{
    interpro: Record<string, unknown>[];
    representativeDomains?: Record<string, unknown>[];
    representativeFamilies?: Record<string, unknown>[];
    unintegrated: Record<string, unknown>[];
    other: Array<MinimalFeature>;
  } | null>(null);
  const processData = useProcessData<EntryMetadata>(
    (
      data?.payload as PayloadList<
        EndpointWithMatchesPayload<EntryMetadata, MatchI>
      >
    )?.results,
    'protein',
  );
  useEffect(() => {
    const payload = data?.payload as PayloadList<
      EndpointWithMatchesPayload<EntryMetadata>
    >;
    if (data && !data.loading) {
      if (processData) {
        onMatchesLoaded?.(payload?.results || []);
        const {
          interpro,
          unintegrated,
          representativeDomains,
          representativeFamilies,
          other,
        } = processData;
        setProcessedData({
          interpro,
          unintegrated,
          representativeDomains,
          representativeFamilies,
          other,
        });
        onFamiliesFound?.(interpro.filter((entry) => entry.type === 'family'));
      }
    }
  }, [data, processData]);

  if (data?.loading && dataFeatures?.loading) return <Loading />;
  const payload = data?.payload as PayloadList<
    EndpointWithMatchesPayload<EntryMetadata>
  >;
  if (!payload?.results) {
    const edgeCaseText = edgeCases.get(STATUS_TIMEOUT);
    if ((data?.payload as ErrorPayload)?.detail === 'Query timed out')
      return <EdgeCase text={edgeCaseText || ''} status={STATUS_TIMEOUT} />;
  }
  if (!processedData) return null;
  const {
    interpro,
    unintegrated,
    other,
    representativeDomains,
    representativeFamilies,
  } = processedData;
  const mergedData = makeTracks({
    interpro: interpro as Array<{ accession: string; type: string }>,
    unintegrated: unintegrated as Array<{ accession: string; type: string }>,
    other: other as Array<MinimalFeature>,
    representativeDomains: representativeDomains as Array<MinimalFeature>,
    representativeFamilies: representativeFamilies as Array<MinimalFeature>,
  });
  if (externalSourcesData.length) {
    mergedData.external_sources = externalSourcesData;
  }

  if (dataResidues && !dataResidues.loading && dataResidues.payload) {
    mergeResidues(mergedData, dataResidues.payload);
  }

  if (dataFeatures && !dataFeatures.loading && dataFeatures.payload) {
    mergeExtraFeatures(mergedData, dataFeatures?.payload);
  }

  proteinViewerReorganization(dataFeatures, mergedData);

  if (
    (!Object.keys(mergedData).length ||
      !Object.values(mergedData)
        .map((x) => x.length)
        .reduce((agg, v) => agg + v, 0)) &&
    !data?.loading &&
    !dataFeatures?.loading &&
    !dataResidues?.loading
  ) {
    return <Callout type="info">No entries match this protein.</Callout>;
  }

  return (
    <>
      <DomainsOnProteinLoaded
        title={title}
        mainData={mainData}
        dataMerged={mergedData}
        dataConfidence={dataConfidence}
        dataVariation={dataVariation}
        dataProteomics={dataProteomics}
        dataFeatures={dataFeatures}
        loading={
          data?.loading ||
          dataFeatures?.loading ||
          dataResidues?.loading ||
          false
        }
        // Disabling Conservation until hmmer is working
        // conservationError={conservation.error}
        // showConservationButton={showConservationButton}
        // handleConservationLoad={fetchConservationData}
      >
        {children}
      </DomainsOnProteinLoaded>
    </>
  );
};

const getRelatedEntriesURL = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | null,
  ) => {
    const newDesc: InterProPartialDescription = {
      main: { key: 'entry' },
      protein: { isFilter: true, db: 'uniprot', accession },
      entry: { db: 'all' },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        page_size: 200,
        extra_fields: 'hierarchy,short_name',
      },
    });
  },
);

const getExtraURL = (query: string) =>
  createSelector(
    (state: GlobalState) => state.settings.api,
    (state: GlobalState) => state.customLocation.description,
    (
      { protocol, hostname, port, root }: ParsedURLServer,
      description: InterProDescription,
    ) => {
      const url = format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(description),
        query: {
          [query]: null,
        },
      });
      return url;
    },
  );

const getVariationURL = createSelector(
  (state: GlobalState) => state.settings.proteinsAPI,
  (state: GlobalState) =>
    state.customLocation.description.protein?.accession || '',
  ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) => {
    const url = format({
      protocol,
      hostname,
      port,
      pathname: root + 'variation/' + accession,
    });
    return url;
  },
);

const getPTMPayload = createSelector(
  (state: GlobalState) => state.settings.proteinsAPI,
  (state: GlobalState) =>
    state.customLocation.description.protein?.accession || '',
  ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) => {
    const url = format({
      protocol,
      hostname,
      port,
      pathname: root + 'proteomics/ptm/' + accession,
    });
    return url;
  },
);

export default loadExternalSources(
  loadData<AlphafoldPayload, 'Prediction'>({
    getUrl: getAlphaFoldPredictionURL,
    propNamespace: 'Prediction',
  } as LoadDataParameters)(
    loadData<AlphafoldConfidencePayload, 'Confidence'>({
      getUrl: getConfidenceURLFromPayload('Prediction'),
      propNamespace: 'Confidence',
    } as LoadDataParameters)(
      loadData<ExtraFeaturesPayload, 'Features'>({
        getUrl: getExtraURL('extra_features'),
        propNamespace: 'Features',
      } as LoadDataParameters)(
        loadData<ResiduesPayload, 'Residues'>({
          getUrl: getExtraURL('residues'),
          propNamespace: 'Residues',
        } as LoadDataParameters)(
          loadData<ProteinsAPIProteomics, 'Proteomics'>({
            getUrl: getPTMPayload,
            propNamespace: 'Proteomics',
          } as LoadDataParameters)(
            loadData<ProteinsAPIVariation, 'Variation'>({
              getUrl: getVariationURL,
              propNamespace: 'Variation',
            } as LoadDataParameters)(
              loadData(getRelatedEntriesURL as LoadDataParameters)(
                DomainOnProteinWithoutData,
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
