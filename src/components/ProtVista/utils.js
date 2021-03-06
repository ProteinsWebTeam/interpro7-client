// @flow
import { createSelector } from 'reselect';
import { toPlural } from 'utils/pages';
import { NOT_MEMBER_DBS } from 'menuConfig';

export const processData = createSelector(
  (data) => data.data.payload.results,
  (data) => data.endpoint,
  (
    dataResults /*: Array<{metadata:{}, extra_fields: {}}> */,
    endpoint /*: string */,
  ) => {
    const results = [];
    for (const item of dataResults) {
      results.splice(
        0,
        0,
        ...item[toPlural(endpoint)].map((match) => ({
          ...match,
          ...item.metadata,
          ...(item.extra_fields || {}),
        })),
      );
    }
    const interpro = results.filter(
      (entry) => entry.source_database.toLowerCase() === 'interpro',
    );
    const interproMap = new Map(
      interpro.map((ipro) => [
        `${ipro.accession}-${ipro.chain}-${ipro.protein}`,
        ipro,
      ]),
    );
    const integrated = results.filter((entry) => entry.integrated);
    const unintegrated = results.filter(
      (entry) =>
        interpro.concat(integrated).indexOf(entry) === -1 &&
        !NOT_MEMBER_DBS.has(entry.source_database.toLowerCase()),
    );
    integrated.forEach((entry) => {
      const ipro =
        interproMap.get(
          `${entry.integrated}-${entry.chain}-${entry.protein}`,
        ) || {};
      if (!ipro.children) ipro.children = [];
      if (ipro.children.indexOf(entry) === -1) ipro.children.push(entry);
    });
    integrated.sort((a, b) => (a.chain ? a.chain.localeCompare(b.chain) : -1));
    return {
      interpro,
      unintegrated,
      other: [],
    };
  },
);
