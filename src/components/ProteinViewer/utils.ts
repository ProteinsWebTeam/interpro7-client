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
    const {
      accession,
      short_name,
      name,
      source_database,
      integrated,
      chain,
      children,
    } = entry;

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
      ...item[toPlural(endpoint)].map((match) => {
        const structureAccession = item.structures?.[0]['accession'];
        return {
          structureAccession,
          ...match,
          ...item.metadata,
          ...(item.extra_fields || {}),
        };
      }),
    );
  }

  const interpro = results.filter(
    (entry) =>
      (entry as unknown as Metadata).source_database.toLowerCase() ===
      'interpro',
  );

  const interproMap = new Map();

  interpro.map((ipro) => {
    const integratedUnder = Object.values(ipro.member_databases as {}).map(
      (entryDict) => Object.keys(entryDict as object)[0],
    );
    const interproK = integratedUnder.map((entryAccession) => {
      return `${ipro.accession}-${entryAccession}-${ipro.chain}-${
        endpoint === 'structure' ? ipro.structureAccession : ipro.protein
      }`;
    });
    interproK.map((k) => {
      interproMap.set(k, ipro);
    });
  });

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
      interproMap.get(
        `${entry.integrated}-${entry.accession}-${entry.chain}-${
          endpoint === 'structure' ? entry.structureAccession : entry.protein
        }`,
      ) || {};

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
