export const experimentTypes = new Map([
  ['x-ray', 'X-ray'],
  ['nmr', 'NMR'],
  ['all', 'All'],
]);
export const formatExperimentType = type =>
  experimentTypes.get((type || '').toLowerCase(), type.toUpperCase());
