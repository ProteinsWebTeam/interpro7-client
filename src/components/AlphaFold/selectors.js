// @flow
import { createSelector } from 'reselect';
import { format } from 'url';

export const getAlphaFoldPredictionURL = createSelector(
  (state) => state.settings.alphafold,
  (state) => state.customLocation.description.protein.accession,
  ({ protocol, hostname, port, root, query }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${accession}`,
      query: query,
    });
  },
);
export const getConfidenceURLFromPayload = (namespace) =>
  createSelector(
    (_, props) => props[`data${namespace}`],
    (dataPrediction) => {
      const cifURL = dataPrediction?.payload?.[0]?.cifUrl;
      return cifURL?.length
        ? cifURL.replace('-model', '-confidence').replace('.cif', '.json')
        : null;
    },
  );
