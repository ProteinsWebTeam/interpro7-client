import { getClanStatus } from './colorPalette';
import { getConnectedAccessions } from './isolatedNodesGrid';
import { ClanNetworkLink, ClanNetworkNode } from './types';

// The API applies the reference pipeline's own inclusion thresholds, which are
// deliberately loose for curators -- SCOOP arrives from 10 up, and below 30 it
// is dominated by false positives. Those matches are not part of the viewer at
// all: not drawn, not in the legend, not searchable.
const MIN_SCORE_BY_METHOD: Record<string, number> = {
  scoop: 30,
};

export const isWeakMatch = (link: ClanNetworkLink): boolean => {
  const minScore = MIN_SCORE_BY_METHOD[(link.method || '').toLowerCase()];
  return minScore !== undefined && link.score < minScore;
};

// Drops the weak links, and with them every node from outside this clan that
// only ever had weak links: it is only here because of what it matches, and
// its only matches were noise.
//
// Members of this clan are always kept, however many links they are left with
// -- the clan is what the user came to look at. One left with none ends up in
// the isolated grid like any other unconnected node. Nodes the API gave no
// links at all are kept too: those are the genuine unconnected results.
export const dropWeakMatches = (
  nodes: Array<ClanNetworkNode>,
  links: Array<ClanNetworkLink>,
  currentClanAccession: string,
): { nodes: Array<ClanNetworkNode>; links: Array<ClanNetworkLink> } => {
  const keptLinks = links.filter((link) => !isWeakMatch(link));
  const linked = getConnectedAccessions(links);
  const stillLinked = getConnectedAccessions(keptLinks);
  return {
    nodes: nodes.filter(
      (node) =>
        getClanStatus(node, currentClanAccession) === 'current-clan' ||
        !linked.has(node.accession) ||
        stillLinked.has(node.accession),
    ),
    links: keptLinks,
  };
};
