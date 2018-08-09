import { createSelector } from 'reselect';
import { toPlural } from 'utils/pages';

export const processData = createSelector(
  data => data.data.payload.results,
  data => data.endpoint,
  (dataResults, endpoint) => {
    const results = [];
    for (const item of dataResults) {
      results.splice(
        0,
        0,
        ...item[toPlural(endpoint)].map(match => ({
          ...match,
          ...item.metadata,
          ...(item.extra_fields || {}),
        })),
      );
    }
    const interpro = results.filter(
      entry => entry.source_database.toLowerCase() === 'interpro',
    );
    const interproMap = new Map(
      interpro.map(ipro => [`${ipro.accession}-${ipro.chain}`, ipro]),
    );
    const integrated = results.filter(entry => entry.integrated);
    const unintegrated = results.filter(
      entry => interpro.concat(integrated).indexOf(entry) === -1,
    );
    integrated.forEach(entry => {
      const ipro = interproMap.get(`${entry.integrated}-${entry.chain}`) || {};
      if (!ipro.children) ipro.children = [];
      if (ipro.children.indexOf(entry) === -1) ipro.children.push(entry);
    });
    return {
      interpro,
      unintegrated,
    };
  },
);
