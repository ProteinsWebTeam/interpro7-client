import { createSelector } from 'reselect';
import { format } from 'url';
import config from 'config';

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
          query: {
            key: config.afdb_key,
          },
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
      return null;
    },
  );
