import { createSelector } from 'reselect';
import { format } from 'url';

export const getAlphaFoldPredictionURL = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root, query }, accession, description) => {
    const descriptionKey = description['main']['key'];
    if (descriptionKey === 'entry' || descriptionKey === 'protein') {
      if (description[descriptionKey]['detail'] !== 'bfvd') {
        // Avoid making this request when we're on the BFVD page.
        return format({
          protocol,
          hostname,
          port,
          pathname: `${root}api/prediction/${accession}`,
        });
      }
    }
    return null;
  },
);

type StartsWithData = `data${string}`;
export const getConfidenceURLFromPayload = (namespace: string) =>
  createSelector(
    (
      state: GlobalState,
      props: { [d: StartsWithData]: RequestedData<AlphafoldPayload> },
    ) => ({
      dataPrediction: props[`data${namespace}`],
      accession: state.customLocation.description.protein.accession,
      search: state.customLocation.search,
    }),
    ({ dataPrediction, accession, search }) => {
      // Try the isoform accession first; AlphaFold only stores the canonical,
      // so fall back to the canonical accession if no match is found.
      const isoformAccession = search.isoform as string | undefined;
      const cifURL =
        (isoformAccession
          ? dataPrediction?.payload?.find(
              (item) => item.uniprotAccession === isoformAccession,
            )?.cifUrl
          : undefined) ??
        dataPrediction?.payload?.find(
          (item) => item.uniprotAccession === accession,
        )?.cifUrl;

      return cifURL?.length
        ? cifURL.replace('-model', '-confidence').replace('.cif', '.json')
        : null;
    },
  );
