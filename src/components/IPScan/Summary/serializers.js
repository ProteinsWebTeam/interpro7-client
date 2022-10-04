// @flow
import { NOT_MEMBER_DBS } from 'menuConfig';
import { iproscan2urlDB } from 'utils/url-patterns';

/*::
type Fragment = {
  start: number,
  end: number,
}
type Location = {
  fragments: Fragment[]
}
*/

const mergeMatch = (match1, match2) => {
  if (!match1) return match2;
  match1.locations = match1.locations.concat(match2.locations);
  return match1;
};
const integrateSignature = (signature, interpro, integrated) => {
  const accession = interpro.accession;
  const entry = integrated.get(accession) || {
    accession,
    name: interpro.name,
    source_database: 'InterPro',
    _children: {},
    children: [],
    type: interpro.type.toLowerCase(),
  };
  entry._children[signature.accession] = signature;
  entry.children = Object.values(entry._children);
  integrated.set(accession, entry);
};

const condenseFragments = (location /*: Location */) => {
  let start = Infinity;
  let end = -Infinity;
  location.fragments.forEach((fr) => {
    start = Math.min(start, fr.start);
    end = Math.max(end, fr.end);
  });
  return [start, end];
};
// const getEdgeCoordinates = ()
const minOverlap = 0.1;
const condenseLocations = (
  children /*: {accession: string, locations: Location[]}[] */,
) => {
  const signatures = [];
  // condensin Fragments for all the signatures and simplyfing the structure to [start, end]
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
  const iprLocations /*: [number, number][] */ = [];
  let currentLocation /*: [number, number] | null */ = null;
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
  iprLocations.push([...(currentLocation || [0, 0])]);

  // Reformating the locations in the expected structure with fragments
  return iprLocations.map(([start, end]) => ({
    fragments: [{ start, end }],
  }));
};

export const mergeData = (matches, sequenceLength) => {
  const mergedData /*: {unintegrated:any[], predictions: any[], family?: any[]} */ =
    {
      unintegrated: [],
      predictions: [],
    };
  const unintegrated = {};
  let integrated = new Map();
  const signatures = new Map();
  for (const match of matches) {
    const { library } = match.signature.signatureLibraryRelease;
    const processedMatch = {
      accession: match.signature.accession,
      name: match.signature.description || match.signature.name,
      short_name: match.signature.name,
      source_database: iproscan2urlDB(library),
      protein_length: sequenceLength,
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
    };
    const residues = match.locations
      .map(({ sites }) =>
        sites
          ? {
              accession: match.signature.accession,
              locations: sites.map((site) => ({
                description: site.description,
                fragments: site.siteLocations,
              })),
            }
          : null,
      )
      .filter(Boolean);
    if (residues.length > 0) processedMatch.residues = residues;

    if (NOT_MEMBER_DBS.has(library)) {
      processedMatch.accession += ` (${mergedData.predictions.length + 1})`;
      processedMatch.source_database = library; // Making sure the change matches the ignore list.
      mergedData.predictions.push(processedMatch);
      continue;
    }
    const mergedMatch = mergeMatch(
      signatures.get(processedMatch.accession),
      processedMatch,
    );
    signatures.set(mergedMatch.accession, mergedMatch);
    if (match.signature.entry) {
      integrateSignature(mergedMatch, match.signature.entry, integrated);
    } else {
      unintegrated[mergedMatch.accession] = mergedMatch;
    }
  }
  mergedData.unintegrated = (Object.values(unintegrated) /*: any */);
  integrated = Array.from(integrated.values()).map((m) => {
    // prettier-ignore
    const locations = condenseLocations((m.children/*: any */));
    return {
      ...m,
      locations,
    };
  });
  (mergedData.unintegrated /*: any[] */)
    .sort((m1, m2) => m2.score - m1.score);
  for (const entry of integrated) {
    if (!mergedData[entry.type]) mergedData[entry.type] = [];
    mergedData[entry.type].push(entry);
  }
  return mergedData;
};
