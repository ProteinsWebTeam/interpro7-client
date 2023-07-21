import { ExtendedFeature } from 'components/ProteinViewer';
const mobiConsensus = 'Consensus Disorder Prediction';
const splitMobiFeatures = (feature: ExtendedFeature) => {
  const newFeatures: Record<string, ExtendedFeature> = {};
  for (const loc of feature.locations || []) {
    const key =
      ((loc.fragments[0] as Record<string, number | string>)
        ?.seq_feature as string) ||
      loc.seq_feature ||
      mobiConsensus;
    if (newFeatures[key]) {
      newFeatures[key].locations?.push(loc);
    } else {
      newFeatures[key] = {
        ...feature,
        accession: `Mobidblt-${key}`,
        locations: [loc],
      };
    }
  }

  return Object.values(newFeatures);
};

const mergeExtraFeatures = (
  data: ProteinViewerDataObject,
  extraFeatures: Record<string, ExtendedFeature>
) => {
  if ('mobidb-lite' in extraFeatures) {
    data.other_features = data.other_features.concat(
      splitMobiFeatures(extraFeatures['mobidb-lite'])
    );
  }
  data.other_features = data.other_features
    .concat(
      Object.values(extraFeatures).filter(
        ({ source_database: db }) => db !== 'mobidblt'
      )
    )
    .sort((a, b) => {
      const { accession: accA, source_database: dbA } = a as Record<
        string,
        string
      >;
      const { accession: accB, source_database: dbB } = b as Record<
        string,
        string
      >;
      if (dbA === dbB) {
        if (accA.includes(mobiConsensus)) return -1;
        if (accB.includes(mobiConsensus)) return 1;
        return 0;
      }
      return dbA.localeCompare(dbB);
    });
  return data;
};
export default mergeExtraFeatures;
