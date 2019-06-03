export const experimentTypes = new Map([['x-ray', 'X-ray'], ['nmr', 'NMR']]);
export const formatExperimentType = type =>
  experimentTypes.get((type || '').toLowerCase(), type.toUpperCase());
