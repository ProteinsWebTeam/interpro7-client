import React, { PropsWithChildren } from 'react';
import { addConfidenceTrack } from 'components/Structure/ViewerAndEntries/ProtVistaForAlphaFold';
import loadable from 'higherOrder/loadable';

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

const UNDERSCORE = /_/g;
const FIRST_IN_ORDER = [
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
  [b, __]: [string, unknown]
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
  dataConfidence?: Object;
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
  const sortedData = Object.entries(dataMerged)
    .sort(byEntryType)
    // “Binding_site” -> “Binding site”
    .map(([key, value]) => [
      key === 'ptm' ? 'PTM' : key.replace(UNDERSCORE, ' '),
      value,
    ]);
  const protein =
    (mainData as ProteinEntryPayload).metadata ||
    (mainData as { payload: ProteinEntryPayload }).payload.metadata;
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
