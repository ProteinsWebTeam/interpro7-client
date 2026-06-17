import { createSelector } from 'reselect';
import { format } from 'url';

// Avoid having selector keyd only to protein accession
// Otherwise the selection of another model from the multimers table
// ends ups loading whatever was cached at the first request
const entryIdFromCifUrl = (cifUrl?: string): string | null => {
  if (!cifUrl) return null;
  const match = cifUrl.match(/files\/(.+?)-model_v/);
  return match?.[1] ?? null;
};

export const getAlphaFoldPredictionURL = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (state: GlobalState) => state.customLocation.description,
  (_: GlobalState, props?: { selectedCifUrl?: string }) =>
    props?.selectedCifUrl,
  (
    { protocol, hostname, port, root },
    accession,
    description,
    selectedCifUrl,
  ) => {
    const descriptionKey = description['main']['key'];
    if (descriptionKey !== 'entry' && descriptionKey !== 'protein') return null;

    const entryId = entryIdFromCifUrl(selectedCifUrl) || accession;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${entryId}`,
    });
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
      let predictionPayload: AlphafoldPayload = dataPrediction.payload || {};
      let matchedCifUrl: string = '';
      let fallbackCifUrl: string = '';

      if (Array.isArray(predictionPayload)) {
        matchedCifUrl = predictionPayload.find(
          (item) =>
            item.uniprotAccession === ((search.isoform as string) || accession),
        )?.cifUrl;

        fallbackCifUrl =
          predictionPayload.length === 1 ? predictionPayload[0].cifUrl : null;
      }

      const cifURL = selectedCifUrl || matchedCifUrl || fallbackCifUrl;

      return cifURL?.length
        ? cifURL.replace('-model', '-confidence').replace('.cif', '.json')
        : null;
    },
  );
