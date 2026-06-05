import { createSelector } from 'reselect';
import { format } from 'url';

export const getAlphaFoldPredictionURL = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root, query }, accession, description) => {
    const descriptionKey = description['main']['key'];
    if (descriptionKey === 'entry' || descriptionKey === 'protein') {
      return format({
        protocol,
        hostname,
        port,
        pathname: `${root}api/prediction/${accession}`,
      });
    }
    return null;
  },
);

type StartsWithData = `data${string}`;
export const getConfidenceURLFromPayload = (namespace: string) =>
  createSelector(
    (
      state: GlobalState,
      props: {
        [d: StartsWithData]: RequestedData<AlphafoldPayload>;
        selectedCifUrl?: string;
      },
    ) => ({
      dataPrediction: props[`data${namespace}`],
      accession: state.customLocation.description.protein.accession,
      search: state.customLocation.search,
      selectedCifUrl: props.selectedCifUrl,
    }),
    ({ dataPrediction, accession, search, selectedCifUrl }) => {
      const cifURL =
        selectedCifUrl ||
        dataPrediction?.payload?.find(
          (item) =>
            item.uniprotAccession === ((search.isoform as string) || accession),
        )?.cifUrl;

      return cifURL?.length
        ? cifURL.replace('-model', '-confidence').replace('.cif', '.json')
        : null;
    },
  );
