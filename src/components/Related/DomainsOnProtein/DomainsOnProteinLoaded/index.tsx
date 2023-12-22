import React, { PropsWithChildren } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProteinViewerForAlphafold';
import loadable from 'higherOrder/loadable';
import {
  groupByEntryType,
  orderByAccession,
} from 'components/Related/DomainsOnProtein';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

const UNDERSCORE = /_/g;
const FIRST_IN_ORDER = [
  'representative_domains',
  'secondary_structure',
  'family',
  'domain',
  'homologous_superfamily',
  'repeat',
  'conserved_site',
  'active_site',
  'binding_site',
  'ptm',
  'unintegrated',
];
const LASTS_IN_ORDER = [
  'other_residues',
  'residues',
  'features',
  'predictions',
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
    if (a.toLowerCase() === l) return 1;
    if (b.toLowerCase() === l) return -1;
  }
  return a > b ? 1 : 0;
};
type tracksProps = {
  interpro: Array<{ accession: string; type: string }>;
  unintegrated: Array<MinimalFeature>;
  other?: Array<MinimalFeature>;
  representativeDomains?: Array<MinimalFeature>;
};
export const makeTracks = ({
  interpro,
  unintegrated,
  other,
  representativeDomains,
}: tracksProps): ProteinViewerDataObject<MinimalFeature> => {
  const groups = groupByEntryType(interpro);
  unintegrated.sort(orderByAccession);
  const mergedData: ProteinViewerDataObject<MinimalFeature> = {
    ...groups,
    unintegrated: unintegrated,
  };
  if (other) mergedData.other_features = other;
  if (representativeDomains?.length)
    mergedData.representative_domains = representativeDomains;
  return mergedData;
};

export const flattenTracksObject = (
  tracksObject: ProteinViewerDataObject,
): ProteinViewerData => {
  return (
    Object.entries(tracksObject)
      .sort(byEntryType)
      // “Binding_site” -> “Binding site”
      .map(([key, value]) => [
        key === 'ptm' ? 'PTM' : key.replace(UNDERSCORE, ' '),
        value,
      ])
  );
};

type Props = PropsWithChildren<{
  mainData:
    | {
        metadata: ProteinMetadata;
      }
    | {
        payload: {
          metadata: ProteinMetadata;
        };
      };
  dataMerged: ProteinViewerDataObject;
  dataConfidence?: RequestedData<AlphafoldConfidencePayload>;
  conservationError?: string | null;
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  loading: boolean;
  title?: string;
}>;

const DomainsOnProteinLoaded = ({
  mainData,
  dataMerged,
  dataConfidence,
  conservationError,
  showConservationButton,
  handleConservationLoad,
  loading,
  children,
  title = 'Entry matches to this protein',
}: Props) => {
  const sortedData = flattenTracksObject(dataMerged);
  const protein =
    (mainData as ProteinEntryPayload).metadata ||
    (mainData as { payload: ProteinEntryPayload }).payload.metadata;

  if (dataConfidence)
    addConfidenceTrack(dataConfidence, protein.accession, sortedData);

  return (
    <ProteinViewer
      protein={protein}
      data={sortedData}
      title={title}
      showConservationButton={showConservationButton}
      handleConservationLoad={handleConservationLoad}
      conservationError={conservationError}
      loading={loading}
    >
      {children}
    </ProteinViewer>
  );
};

export default DomainsOnProteinLoaded;
