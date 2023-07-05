import React, { PropsWithChildren, useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { edgeCases, STATUS_TIMEOUT } from 'utils/server-message';

import {
  getAlphaFoldPredictionURL,
  getConfidenceURLFromPayload,
} from 'components/AlphaFold/selectors';
import { processData } from 'components/ProteinViewer/utils';
import ProteinEntryHierarchy from 'components/Protein/ProteinEntryHierarchy';
import Loading from 'components/SimpleCommonComponents/Loading';
import EdgeCase from 'components/EdgeCase';

import ConservationProvider, {
  mergeConservationData,
  // Disabling Conservation until hmmer is working
  // isConservationDataAvailable,
} from './ConservationProvider';
import mergeExtraFeatures from './mergeExtraFeatures';
import mergeResidues from './mergeResidues';
import DomainsOnProteinLoaded from './DomainsOnProteinLoaded';
import loadExternalSources, { ExtenalSourcesProps } from './ExternalSourcesHOC';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
const css = cssBinder(ipro);

const HTTP_OK = 200;

export const orderByAccession = (
  a: { accession: string },
  b: { accession: string }
) => (a.accession > b.accession ? 1 : -1);

export const groupByEntryType = (
  interpro: Array<{
    accession: string;
    type: string;
  }>
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

type Props = PropsWithChildren<{
  mainData: { metadata: ProteinMetadata };
  onMatchesLoaded?: (results: EntryProteinPayload[]) => void;
}>;
interface LoadedProps
  extends Props,
    ExtenalSourcesProps,
    LoadDataProps<ExtraFeaturesPayload, 'Features'>,
    LoadDataProps<ResiduesPayload, 'Residues'>,
    LoadDataProps<AlphafoldConfidencePayload, 'Confidence'>,
    LoadDataProps<AlphafoldPayload, 'Prediction'>,
    LoadDataProps<PayloadList<EntryProteinPayload> | ErrorPayload> {}

const DomainOnProteinWithoutData = ({
  data,
  mainData,
  dataResidues,
  dataFeatures,
  dataConfidence,
  onMatchesLoaded,
  children,
  externalSourcesData,
}: LoadedProps) => {
  const [conservation, setConservation] = useState<{
    generateData: boolean;
    showButton: boolean;
    data: ConservationPayload | null;
    error: string | null;
  }>({
    generateData: false,
    showButton: false,
    data: null,
    error: null,
  });
  useEffect(() => {
    const payload = data?.payload as PayloadList<EntryProteinPayload>;
    if (data && !data.loading && payload?.results && onMatchesLoaded)
      onMatchesLoaded(payload.results);
  }, [data]);

  if (
    (!data || data.loading) &&
    (!dataFeatures || dataFeatures.loading || !dataFeatures.payload)
  )
    return <Loading />;
  const payload = data?.payload as PayloadList<EntryProteinPayload>;
  if (!payload?.results) {
    const edgeCaseText = edgeCases.get(STATUS_TIMEOUT);
    if ((data?.payload as ErrorPayload)?.detail === 'Query timed out')
      return <EdgeCase text={edgeCaseText || ''} status={STATUS_TIMEOUT} />;
  }

  const { interpro, unintegrated, other } = processData({
    data: data as unknown as RequestedData<
      PayloadList<ExpectedPayload<ProteinMetadata>>
    >,
    endpoint: 'protein',
  });
  const interproFamilies = interpro.filter((entry) => entry.type === 'family');
  const groups = groupByEntryType(
    interpro as Array<{ accession: string; type: string }>
  );
  (unintegrated as Array<{ accession: string; type: string }>).sort(
    orderByAccession
  );
  const mergedData: ProteinViewerDataObject<MinimalFeature> = {
    ...groups,
    unintegrated: unintegrated as Array<MinimalFeature>,
    other_features: other,
  };

  if (externalSourcesData.length) {
    mergedData.external_sources = externalSourcesData;
  }

  if (dataResidues && !dataResidues.loading && dataResidues.payload) {
    mergeResidues(mergedData, dataResidues.payload);
  }
  if (dataFeatures && !dataFeatures.loading && dataFeatures.payload) {
    mergeExtraFeatures(mergedData, dataFeatures?.payload);
  }
  if (conservation.data) {
    mergeConservationData(mergedData, conservation.data);
  }
  // Disabling Conservation until hmmer is working
  // const fetchConservationData = () => {
  //   setConservation({ ...conservation, generateData: true });
  // };

  if (
    (!Object.keys(mergedData).length ||
      !Object.values(mergedData)
        .map((x) => x.length)
        .reduce((agg, v) => agg + v, 0)) &&
    !data?.loading &&
    !dataFeatures?.loading &&
    !dataResidues?.loading
  ) {
    return <div className={css('callout')}>No entries match this protein.</div>;
  }
  // Disabling Conservation until hmmer is working
  // const showConservationButton =
  //   // check if conservation data has already been generated
  //   !conservation.data &&
  //   // or if the conditions to calculate conservation are met.
  //   isConservationDataAvailable(mergedData, mainData.metadata.source_database);

  return (
    <>
      <ConservationProvider
        generateData={conservation.generateData}
        handleLoaded={(data) =>
          setConservation({
            ...conservation,
            data: data,
            error: null,
          })
        }
        handleError={(payload) => {
          let message = 'Unknown issue fetching the data.';
          if (payload.status) {
            message =
              payload.status === HTTP_OK
                ? 'The server responded OK, however the payload is empty'
                : `Server code - ${payload.status}`;
          }
          setConservation({
            ...conservation,
            data: null,
            error: `ERROR: ${message}`,
          });
        }}
      />
      <div className={css('margin-bottom-large')}>
        <h5>Protein family membership</h5>
        {interproFamilies.length ? (
          //@ts-ignore
          <ProteinEntryHierarchy entries={interproFamilies} />
        ) : (
          <p className={css('margin-bottom-medium')}>None predicted</p>
        )}
      </div>

      <DomainsOnProteinLoaded
        mainData={mainData}
        dataMerged={mergedData}
        dataConfidence={dataConfidence}
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
  ({ protocol, hostname, port, root }: ParsedURLServer, accession: string) => {
    const newDesc = {
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
  }
);

const getExtraURL = (query: string) =>
  createSelector(
    (state: GlobalState) => state.settings.api,
    (state: GlobalState) => state.customLocation.description,
    (
      { protocol, hostname, port, root }: ParsedURLServer,
      description: InterProDescription
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
    }
  );

export default loadExternalSources(
  loadData<AlphafoldPayload, 'Prediction'>({
    getUrl: getAlphaFoldPredictionURL,
    propNamespace: 'Prediction',
  } as Params)(
    loadData<AlphafoldConfidencePayload, 'Confidence'>({
      getUrl: getConfidenceURLFromPayload('Prediction'),
      propNamespace: 'Confidence',
    } as Params)(
      loadData<ExtraFeaturesPayload, 'Features'>({
        getUrl: getExtraURL('extra_features'),
        propNamespace: 'Features',
      } as Params)(
        loadData<ResiduesPayload, 'Residues'>({
          getUrl: getExtraURL('residues'),
          propNamespace: 'Residues',
        } as Params)(
          loadData(getRelatedEntriesURL as Params)(DomainOnProteinWithoutData)
        )
      )
    )
  )
);
