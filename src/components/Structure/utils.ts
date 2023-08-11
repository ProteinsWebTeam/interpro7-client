export const experimentTypes = new Map([
  ['x-ray', 'X-ray'],
  ['nmr', 'NMR'],
  ['all', 'All'],
  ['em', 'Cryo-EM'],
]);
export const formatExperimentType = (type: string) =>
  experimentTypes.get((type || '').toLowerCase()) || type.toUpperCase();
