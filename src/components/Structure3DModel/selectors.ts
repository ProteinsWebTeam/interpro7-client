import { createSelector } from 'reselect';
import { format } from 'url';

export const getAlphaFoldPredictionURL = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root, query }, accession, description) => {
    const descriptionKey = description['main']['key'];
    if (descriptionKey === 'entry' || descriptionKey === 'protein') {
      if (description[descriptionKey]['detail'] === 'alphafold') {
        return format({
          protocol,
          hostname,
          port,
          pathname: `${root}api/prediction/${accession}`,
          query: query,
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
      _: GlobalState,
      props: { [d: StartsWithData]: RequestedData<AlphafoldPayload> },
    ) => props[`data${namespace}`],
    (dataPrediction: RequestedData<AlphafoldPayload>) => {
      const cifURL = dataPrediction?.payload?.[0]?.cifUrl;
      return cifURL?.length
        ? cifURL.replace('-model', '-confidence').replace('.cif', '.json')
        : null;
    },
  );
