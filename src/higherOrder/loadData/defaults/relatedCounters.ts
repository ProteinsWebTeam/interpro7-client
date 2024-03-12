export const getNeededCountersForSubpages = (
  mainEndpoint: Endpoint,
  filterEndpoint: Endpoint,
  forExporter = false,
) => {
  const counters = [];
  if (forExporter) {
    if (['taxonomy', 'proteome', 'set'].includes(filterEndpoint)) {
      counters.push('protein');
      counters.push('entry');
    }
  } else {
    if (['entry', 'taxonomy', 'set'].includes(mainEndpoint)) {
      if (['taxonomy', 'proteome'].includes(filterEndpoint)) {
        counters.push('protein');
      }
    }
  }
  if (counters.length) return `counters:${counters.join('-')}`;
  return '';
};
