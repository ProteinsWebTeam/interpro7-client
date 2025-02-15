import { useMemo } from 'react';
import { toPlural } from 'utils/pages/toPlural';
import { NOT_MEMBER_DBS } from 'menuConfig';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

export const selectRepresentativeData = (
  entries: Record<string, unknown>[],
  locationKey: string,
  type: string,
) => {
  const flatRepresentativeData = [];

  for (const entry of entries) {
    const { accession, short_name, name, source_database, integrated, chain } =
      entry;

    if (
      entry[locationKey] === null ||
      (entry.type !== type &&
        (type === 'domain' ? entry.type !== 'repeat' : true)) // Handles repeat types, which fall under the "domain" cateogory
    ) {
      continue;
    }
    for (const location of entry[locationKey] as Array<ProtVistaLocation>) {
      for (const fragment of location.fragments) {
        const { start, end } = fragment;
        const representative = location.representative;
        if (location.representative) {
          flatRepresentativeData.push({
            accession,
            chain,
            short_name,
            name,
            source_database,
            integrated,
            representative,
            start,
            end,
            color: getTrackColor({ source_database }, EntryColorMode.MEMBER_DB),
            length: end - start + 1,
          });
        }
      }
    }
  }

  return flatRepresentativeData;
};

export const useProcessData = <M = Metadata>(
  results: EndpointWithMatchesPayload<M, MatchI>[] | undefined,
  endpoint: Endpoint,
) =>
  useMemo(() => {
    return processData(results || [], endpoint);
  }, [results, endpoint]);

const processData = <M = Metadata>(
  dataResults: EndpointWithMatchesPayload<M>[],
  endpoint: Endpoint,
) => {
  const results: Record<string, unknown>[] = [];
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
    (entry) =>
      (entry as unknown as Metadata).source_database.toLowerCase() ===
      'interpro',
  );

  const locationKey =
    endpoint === 'structure'
      ? 'entry_structure_locations'
      : 'entry_protein_locations';

  const representativeData = {
    domains: selectRepresentativeData(results, locationKey, 'domain'),
    families: selectRepresentativeData(results, locationKey, 'family'),
  };

  const representativeDomains = representativeData['domains'];
  const representativeFamilies = representativeData['families'];

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
      !NOT_MEMBER_DBS.has(
        (entry as unknown as Metadata).source_database.toLowerCase(),
      ),
  );
  integrated.forEach((entry) => {
    const ipro: Record<string, unknown> & {
      children?: Array<Record<string, unknown>>;
    } =
      interproMap.get(`${entry.integrated}-${entry.chain}-${entry.protein}`) ||
      {};
    if (!ipro.children) ipro.children = [];
    if (ipro.children.indexOf(entry) === -1) ipro.children.push(entry);
  });
  integrated.sort((a, b) =>
    a.chain ? (a.chain as string).localeCompare(b.chain as string) : -1,
  );
  return {
    interpro,
    unintegrated,
    representativeDomains,
    representativeFamilies,
    other: [],
  };
};
