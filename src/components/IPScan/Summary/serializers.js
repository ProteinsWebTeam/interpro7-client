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

const OTHER_FEATURES_DBS = ['funfam'];
const OTHER_RESIDUES_DBS = ['pirsr'];

const mergeMatch = (match1, match2) => {
  if (!match1) return match2;
  match1.locations = match1.locations.concat(match2.locations);
  return match1;
};
const integrateSignature = (signature, interpro, integrated) => {
  const accession = interpro.accession;
  const entry = integrated.get(accession) || {
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

const match2residues = (match) => {
  return match.locations
    .map(({ sites }) =>
      sites
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

// eslint-disable-next-line max-statements
export const mergeData = (matches, sequenceLength) => {
  const mergedData /*: {
    unintegrated:any[],
    other_features: any[],
    residues: any[],
    other_residues: any[],
  } */ = {
    unintegrated: [],
    other_features: [],
    residues: [],
    other_residues: [],
  };
  const unintegrated = {};
  const otherFeatures = {};
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
      signature: undefined,
    };
    const residues = match2residues(match);
    if (
      residues.length > 0 &&
      !OTHER_RESIDUES_DBS.includes(residues?.[0].source_database)
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
      mergedData.other_residues.push(residues[0]);
    } else {
      unintegrated[mergedMatch.accession] = mergedMatch;
    }
  }
  mergedData.unintegrated = (Object.values(unintegrated) /*: any */);
  mergedData.other_features.push(...(Object.values(otherFeatures) /*: any */));
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
