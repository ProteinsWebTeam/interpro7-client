import { useMemo } from 'react';
import { toPlural } from 'utils/pages/toPlural';
import { NOT_MEMBER_DBS } from 'menuConfig';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

const dbs4SingleDomain = [
  'pfam',
  'smart',
  'pirsf',
  'ncbifam',
  'hamap',
  'sfld',
  'cdd',
  'profile',
];

const selectRepresentativeDomains = (domains: Record<string, unknown>[]) => {
  const flatDomains = [];
  for (const domain of domains) {
    const { accession, short_name, name, source_database, integrated } = domain;
    for (const location of domain.entry_protein_locations as Array<ProtVistaLocation>) {
      for (const fragment of location.fragments) {
        const { start, end } = fragment;
        flatDomains.push({
          accession,
          short_name,
          name,
          source_database,
          integrated,
          start,
          end,
          color: getTrackColor({ source_database }, EntryColorMode.MEMBER_DB),
          length: end - start + 1,
          keep: true,
        });
      }
    }
  }
  for (const dom1 of flatDomains) {
    for (const dom2 of flatDomains) {
      if (dom1 === dom2 || !dom1.keep || !dom2.keep) continue;
      const overlap =
        Math.min(dom1.end, dom2.end) - Math.max(dom1.start, dom2.start) + 1;
      if (overlap > 0) {
        if (overlap > 0.7 * dom1.length && overlap > 0.7 * dom2.length) {
          if (
            dom1.length < dom2.length ||
            (dom1.length === dom2.length && dom2.source_database === 'pfam')
          ) {
            dom1.keep = false;
          }
        } else if (overlap > 0.7 * dom1.length && overlap < 0.7 * dom2.length) {
          dom1.keep = false;
        }
      }
    }
  }
  return flatDomains.filter(({ keep }) => keep);
};
export const useProcessData = <M = Metadata>(request: Data<M>) =>
  useMemo(() => {
    return request.data
      ? processData(request?.data?.payload?.results || [], request.endpoint)
      : null;
  }, [request]);

const processData = <M = Metadata>(
  dataResults: EndpointWithMatchesPayload<M>[],
  endpoint: Endpoint
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
      }))
    );
  }
  const interpro = results.filter(
    (entry) =>
      (entry as unknown as Metadata).source_database.toLowerCase() ===
      'interpro'
  );

  const representativeDomains = selectRepresentativeDomains(
    results.filter(
      (entry) =>
        dbs4SingleDomain.includes(
          (entry as unknown as Metadata).source_database.toLowerCase()
        ) &&
        (entry as unknown as EntryMetadata)?.type?.toLowerCase() !== 'family'
    )
  );
  const interproMap = new Map(
    interpro.map((ipro) => [
      `${ipro.accession}-${ipro.chain}-${ipro.protein}`,
      ipro,
    ])
  );
  const integrated = results.filter((entry) => entry.integrated);
  const unintegrated = results.filter(
    (entry) =>
      interpro.concat(integrated).indexOf(entry) === -1 &&
      !NOT_MEMBER_DBS.has(
        (entry as unknown as Metadata).source_database.toLowerCase()
      )
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
    a.chain ? (a.chain as string).localeCompare(b.chain as string) : -1
  );
  return {
    interpro,
    unintegrated,
    representativeDomains,
    other: [],
  };
};
