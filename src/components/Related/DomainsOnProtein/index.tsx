import React, { PropsWithChildren, useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { edgeCases, STATUS_TIMEOUT } from 'utils/server-message';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
} from 'components/AlphaFold/selectors';
import { useProcessData } from 'components/ProteinViewer/utils';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import EdgeCase from 'components/EdgeCase';

import mergeExtraFeatures from './mergeExtraFeatures';
import mergeResidues from './mergeResidues';
import DomainsOnProteinLoaded, { makeTracks } from './DomainsOnProteinLoaded';
import loadExternalSources, { ExtenalSourcesProps } from './ExternalSourcesHOC';
import { ProteinsAPIVariation } from '@nightingale-elements/nightingale-variation/dist/proteinAPI';
import { proteinViewerReorganization } from './utils';
import { sortTracks } from './DomainsOnProteinLoaded/utils';
import { connect } from 'react-redux';
import { changeSettingsRaw } from 'actions/creators';

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
  matchTypeSettings: MatchTypeUISettings;
  colorDomainsBy: string;
  showMoreSettings?: boolean;
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
    LoadDataProps<InterProNMatches, 'InterProNMatches'>,
    LoadDataProps<
      PayloadList<EndpointWithMatchesPayload<EntryMetadata>> | ErrorPayload
    > {}

const dataIsEmpty = (data: ProteinViewerDataObject): boolean => {
  return (
    !Object.keys(data).length ||
    !Object.values(data)
      .map((x) => x.length)
      .reduce((agg, v) => agg + v, 0)
  );
};

const DomainOnProteinWithoutData = ({
  data,
  mainData,
  dataResidues,
  dataFeatures,
  dataConfidence,
  dataVariation,
  dataProteomics,
  dataInterProNMatches,
  onMatchesLoaded,
  onFamiliesFound,
  children,
  externalSourcesData,
  title,
  matchTypeSettings,
  colorDomainsBy,
  showMoreSettings,
}: LoadedProps) => {
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

  const dataIsEmptyBeforeMergingFeatures = dataIsEmpty(mergedData);
  let extraFeaturesCount = 0;

  if (dataFeatures && !dataFeatures.loading && dataFeatures.payload) {
    mergeExtraFeatures(mergedData, dataFeatures?.payload);
  }

  const proteinViewerData = proteinViewerReorganization(
    dataFeatures,
    mergedData,
  );

  const onlyExtraFeatures =
    dataIsEmptyBeforeMergingFeatures && extraFeaturesCount > 0;

  if (
    // No entries and no extra features
    (dataIsEmpty(mergedData) &&
      !data?.loading &&
      !dataResidues?.loading &&
      !dataFeatures?.loading) ||
    // No entries but extra features (e.g pfam-n)
    (onlyExtraFeatures && !showMoreSettings)
  ) {
    return (
      <>
        <Callout type="info">
          {' '}
          {onlyExtraFeatures && !showMoreSettings
            ? `Additional matches are available, but not displayed in the summary display mode. 
        Switch to the full display mode the see them.`
            : 'No entry matches this protein'}
        </Callout>

        <DomainsOnProteinLoaded
          title={'Entry matches to this protein'}
          mainData={mainData}
          dataMerged={proteinViewerData}
          dataConfidence={dataConfidence}
          loading={
            data?.loading ||
            dataFeatures?.loading ||
            dataResidues?.loading ||
            false
          }
        >
          {children}
        </DomainsOnProteinLoaded>
      </>
    );
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
        dataInterProNMatches={dataInterProNMatches}
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

const getInterProNMatches = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | null,
  ) => {
    const newDesc: InterProPartialDescription = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDesc),
      query: {
        interpro_n: '',
      },
    });
  },
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: UISettings) => ({
    matchTypeSettings: ui.matchTypeSettings,
    colorDomainsBy: ui.colorDomainsBy,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(
  loadExternalSources(
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
                loadData<InterProNMatches, 'InterProNMatches'>({
                  getUrl: getInterProNMatches,
                  propNamespace: 'InterProNMatches',
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
    ),
  ),
);
