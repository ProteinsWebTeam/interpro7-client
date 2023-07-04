import { ExtendedFeature } from 'components/ProteinViewer';

const splitMobiFeatures = (feature: ExtendedFeature) => {
  const newFeatures: Record<string, ExtendedFeature> = {};
  for (const loc of feature.locations || []) {
    const key =
      ((loc.fragments[0] as Record<string, number | string>)
        ?.seq_feature as string) ||
      loc.seq_feature ||
      'Consensus Disorder Prediction';
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

  const sortedObj = Object.keys(newFeatures)
    .sort((a, b) => {
      return a === 'Consensus Disorder Prediction' &&
        b !== 'Consensus Disorder Prediction'
        ? -1
        : 1;
    })
    .reduce((acc, key) => {
      acc[key] = newFeatures[key];
      return acc;
    }, {} as Record<string, ExtendedFeature>);
  return Object.values(sortedObj);
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
  data.other_features = data.other_features.concat(
    Object.values(extraFeatures).filter(
      ({ source_database: db }) => db !== 'mobidblt'
    )
  );
  return data;
};
export default mergeExtraFeatures;
