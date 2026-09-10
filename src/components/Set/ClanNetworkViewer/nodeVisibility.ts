import { edgeFilterKeys } from './buildEdges';
import { nodeFilterKeys } from './buildNodes';
import { getClanStatus } from './colorPalette';
import { FilterKey, isFilteredOut } from './filterKeys';
import { ClanNetworkLink, ClanNetworkNode } from './types';

// Which nodes the legend filters take off the canvas. Two things hide a node:
// a switched-off key of its own (its membership status, its entry type), and
// -- for a node from outside this clan -- losing every one of its edges to the
// edge filters. Such a node is only on the canvas because of what it matches, so
// with no matches left it is noise.
//
// Members of this clan always stay, whatever is left of their edges: the clan
// is what the user came to look at, and "this member has no matches of the
// kind you're showing" is itself a result. Nodes the API gave no links at all
// stay too -- they have their own grid (see isolatedNodesGrid.ts), and there
// was no connection for the filters to take away.
//
// Only the edge filters (method, strength tier, nested) strand anything: an
// edge counts as still there if it survives them, whatever happened to its
// ends. The node filters (membership status, entry type) deliberately never
// do -- hiding, say, every family should take the families away, not also the
// repeats they happened to connect. That also means stranding cannot cascade:
// a stranded node is hidden, but hiding a node never strands another.
export const getHiddenAccessions = (
  nodes: Array<ClanNetworkNode>,
  links: Array<ClanNetworkLink>,
  currentClanAccession: string,
  disabled: Set<FilterKey>,
): Set<string> => {
  const hidden = new Set(
    nodes
      .filter((node) =>
        isFilteredOut(nodeFilterKeys(node, currentClanAccession), disabled),
      )
      .map((node) => node.accession),
  );

  const linked = new Set<string>();
  const stillLinked = new Set<string>();
  for (const link of links) {
    linked.add(link.source);
    linked.add(link.target);
    if (isFilteredOut(edgeFilterKeys(link), disabled)) continue;
    stillLinked.add(link.source);
    stillLinked.add(link.target);
  }

  for (const node of nodes) {
    if (getClanStatus(node, currentClanAccession) === 'current-clan') continue;
    if (linked.has(node.accession) && !stillLinked.has(node.accession)) {
      hidden.add(node.accession);
    }
  }
  return hidden;
};

// What focusing on a node keeps on the canvas: the node itself and its
// neighbours -- nodes never connected to it are left out, clan members
// included -- with the filters applied on top by the same rules as above,
// within the neighbourhood:
// - a neighbour hidden by the filters stays hidden, so focusing never brings
//   back anything they took away;
// - a neighbour from outside this clan goes once every edge between it and the
//   focused node is filtered out, as those are all it has on screen;
// - a member of this clan stays, whatever happens to its edges.
export const getFocusAccessions = (
  focusAccession: string,
  nodes: Array<ClanNetworkNode>,
  links: Array<ClanNetworkLink>,
  currentClanAccession: string,
  hidden: Set<string>,
  disabled: Set<FilterKey>,
): Set<string> => {
  const clanMembers = new Set(
    nodes
      .filter(
        (node) => getClanStatus(node, currentClanAccession) === 'current-clan',
      )
      .map((node) => node.accession),
  );
  const focused = new Set([focusAccession]);
  for (const link of links) {
    if (link.source !== focusAccession && link.target !== focusAccession) {
      continue;
    }
    const neighbour =
      link.source === focusAccession ? link.target : link.source;
    if (hidden.has(neighbour)) continue;
    if (
      clanMembers.has(neighbour) ||
      !isFilteredOut(edgeFilterKeys(link), disabled)
    ) {
      focused.add(neighbour);
    }
  }
  return focused;
};
