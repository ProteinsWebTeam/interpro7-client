import { NOT_MEMBER_DBS } from 'menuConfig';
import { iproscan2urlDB } from 'utils/url-patterns';

const OTHER_FEATURES_DBS = ['mobidb-lite', 'cath-funfam'];
const OTHER_RESIDUES_DBS = [''];

type IpScanEntry = {
  accession: string;
  name: string;
  short_name: string;
  source_database: string;
  _children: Record<string, IpScanMatch>;
  children: Array<IpScanMatch>;
  type: string;
};
type IpScanMatch = {
  accession: string;
  name: string;
  short_name: string;
  type?: string;
  source_database: string;
  protein_length: number;
  locations: Array<BaseLocation & Iprscan5Location>;
  score?: number;
  residues: undefined;
  signature?: Iprscan5Signature;
};

const mergeMatch = (match1: IpScanMatch | undefined, match2: IpScanMatch) => {
  if (!match1) return match2;
  match1.locations = match1.locations.concat(match2?.locations);
  return match1;
};

const integrateSignature = (
  signature: IpScanMatch,
  interpro: Iprscan5Entry,
  integrated: Map<string, IpScanEntry>,
) => {
  const accession = interpro.accession;
  const entry: IpScanEntry = integrated.get(accession) || {
    accession,
    name: interpro.description,
    short_name: interpro.name,
    source_database: 'interpro',
    _children: {},
    children: [],
    type: interpro.type.toLowerCase(),
  };
  entry._children[signature.accession] = signature;
  entry.children = Object.values(entry._children);
  integrated.set(accession, entry);
};

const match2residues = (match: Iprscan5Match | IpScanMatch) => {
  return match.locations
    .map(({ sites }) =>
      sites?.length && sites?.length > 0
        ? {
            accession: match?.signature?.accession || match?.accession,
            locations: sites.map((site) => ({
              description: `${site.label || ''}${site.label ? ': ' : ''}${
                site.description
              }`,
              fragments: site.siteLocations,
            })),
            type: 'residue',
            source_database:
              match?.signature?.signatureLibraryRelease?.library?.toLowerCase() ||
              match.source_database,
          }
        : null,
    )
    .filter(Boolean);
};

const condenseFragments = (location: BaseLocation): [number, number] => {
  let start = Infinity;
  let end = -Infinity;
  location.fragments.forEach((fr) => {
    start = Math.min(start, fr.start);
    end = Math.max(end, fr.end);
  });
  return [start, end];
};

const minOverlap = 0.1;

const condenseLocations = (
  children: Array<{ accession: string; locations: BaseLocation[] }>,
) => {
  const signatures: Array<[number, number]> = [];
  // condensing Fragments for all the signatures and simplyfing the structure to [start, end]
  children.forEach(({ locations }) => {
    signatures.push(...locations.map(condenseFragments));
  });
  // sorting the simplified locations by position
  signatures.sort((a, b) => {
    if (a[0] > b[0]) return 1;
    else if (a[0] < b[0]) return -1;
    else if (a[1] < b[1]) return -1;
    return 1;
  });
  const iprLocations: Array<[number, number]> = [];
  let currentLocation: [number, number] | null = null;
  signatures.forEach(([s, e]) => {
    // First location become the current location
    if (currentLocation === null) {
      currentLocation = [s, e];
      return;
    }
    const [start, end] = currentLocation;

    // the end of the new location is before than the current location, which means is fully embedded, so there is nothing to do.
    if (e <= end) return;

    // Locations are overlapping (at least one residue)
    if (s <= end) {
      const overlap = Math.min(end, e) - Math.max(start, s) + 1;
      const shortest = Math.min(end - start, e - s) + 1;
      // If the overlap is bigger than the threshold in minOverlap, the current location gets extended to fully embed the new one
      if (overlap >= shortest * minOverlap) currentLocation[1] = e;
      return;
    }

    // none of the othere conditions where true, means that the new location doesn't overlap.
    // So we add the current location to the result, and reset it to the new coordinates.
    iprLocations.push([...currentLocation]);
    currentLocation = [s, e];
  });
  // Adding last location
  iprLocations.push([...(currentLocation || [0, 0])] as [number, number]);

  // Reformating the locations in the expected structure with fragments
  return iprLocations.map(([start, end]) => ({
    fragments: [{ start, end }],
  }));
};

// eslint-disable-next-line max-statements
export const mergeData = (
  matches: Array<Iprscan5Match>,
  sequenceLength?: number,
) => {
  const mergedData: Record<string, Record<string, unknown>[]> = {
    unintegrated: [],
    other_features: [],
    residues: [],
    other_residues: [],
    representative_domains: [],
    representative_families: [],
  };
  const unintegrated: Record<string, IpScanMatch> = {};
  const otherFeatures: Record<string, IpScanMatch> = {};
  let integrated = new Map<string, IpScanEntry>();
  const signatures = new Map<string, IpScanMatch>();
  const representativeDomains = [];
  const representativeFamilies = [];

  for (const match of matches) {
    const { library } = match.signature.signatureLibraryRelease;
    const processedMatch: IpScanMatch = {
      accession: match.signature.accession,
      name: match.signature.description || match.signature.name,
      short_name: match.signature.name,
      type: match.signature.type,
      source_database: iproscan2urlDB(library),
      protein_length: sequenceLength || 0,
      locations: match.locations.map((loc) => ({
        ...loc,
        model_acc: match['model-ac'],
        fragments:
          loc['location-fragments'] && loc['location-fragments'].length
            ? loc['location-fragments']
            : [{ start: loc.start, end: loc.end }],
      })),
      score: match.score,
      residues: undefined,
      signature: undefined,
    };

    const residues = match2residues(match);

    if (
      residues.length > 0 &&
      !OTHER_RESIDUES_DBS.includes(residues?.[0]?.source_database || '')
    ) {
      mergedData.residues.push({
        ...processedMatch,
        accession: `residue:${processedMatch.accession}`,
        residues,
      });
    }
    if (NOT_MEMBER_DBS.has(library)) {
      processedMatch.source_database = library; // Making sure the change matches the ignore list.
      if (processedMatch.accession in otherFeatures) {
        otherFeatures[processedMatch.accession].locations.push(
          ...processedMatch.locations,
        );
      } else {
        otherFeatures[processedMatch.accession] = processedMatch;
      }
      continue;
    }
    const mergedMatch = mergeMatch(
      signatures.get(processedMatch.accession),
      processedMatch,
    );

    signatures.set(mergedMatch.accession, mergedMatch);
    if (match.signature.entry) {
      integrateSignature(mergedMatch, match.signature.entry, integrated);
    } else if (OTHER_FEATURES_DBS.includes(mergedMatch.source_database)) {
      mergedData.other_features.push(mergedMatch);
    } else if (OTHER_RESIDUES_DBS.includes(mergedMatch.source_database)) {
      const residues = match2residues(mergedMatch);
      if (residues[0] && residues[0].locations.length !== 0)
        mergedData.other_residues.push(residues[0]);
    } else {
      unintegrated[mergedMatch.accession] = mergedMatch;
    }

    const representativeLocations = processedMatch.locations.filter(
      (loc) => loc.representative,
    );

    if (representativeLocations.length) {
      if (match.signature?.type?.toLowerCase() === 'family') {
        representativeFamilies.push({
          ...processedMatch,
          locations: representativeLocations,
          integrated: match.signature?.entry?.accession,
        });
      } else {
        // domains, homologous_superfamily
        representativeDomains.push({
          ...processedMatch,
          locations: representativeLocations,
          integrated: match.signature?.entry?.accession,
        });
      }
    }
  }

  mergedData.unintegrated = Object.values(unintegrated);
  mergedData.other_features.push(...Object.values(otherFeatures));
  const integratedList = Array.from(integrated.values()).map((m) => {
    const locations = condenseLocations(m.children);
    return {
      ...m,
      locations,
    };
  });
  mergedData.unintegrated.sort(
    (m1, m2) =>
      (m2 as { score: number }).score - (m1 as { score: number }).score,
  );
  for (const entry of integratedList) {
    if (!mergedData[entry.type]) mergedData[entry.type] = [];
    mergedData[entry.type].push(entry);
  }
  if (representativeDomains?.length) {
    mergedData.representative_domains = representativeDomains;
  }
  if (representativeFamilies?.length) {
    mergedData.representative_families = representativeFamilies;
  }

  return mergedData;
};
