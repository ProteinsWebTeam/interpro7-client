import { edgeFilterKeys } from './buildEdges';
import { nodeFilterKeys } from './buildNodes';
import { FilterKey, isFilteredOut } from './filterKeys';
import { ClanNetworkLink, ClanNetworkNode } from './types';

// Which nodes the legend filters take off the canvas. Two things hide a node:
// a switched-off key of its own (its membership status, its entry type), and
// -- for a node that was drawn as part of the graph -- losing every one of its
// edges to the filters, since a lone dot stranded mid-canvas reads as noise
// rather than as a result.
//
// Nodes the API gave no links at all are the deliberate exception: they are
// genuine "nothing matched this one" results, they have their own grid off to
// the side (see isolatedNodesGrid.ts), and hiding them would silently shrink
// the clan the user came to look at. So the stranding rule only ever applies
// to a node that had an edge to lose.
//
// An edge counts as still there only if it survives the filters itself *and*
// both of its ends do. That is a single pass, deliberately: stranding does not
// cascade, so hiding a hub strands its leaves but those leaves never go on to
// strand anything further -- one click of the legend stays explicable.
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
    if (hidden.has(link.source) || hidden.has(link.target)) continue;
    stillLinked.add(link.source);
    stillLinked.add(link.target);
  }

  for (const node of nodes) {
    if (linked.has(node.accession) && !stillLinked.has(node.accession)) {
      hidden.add(node.accession);
    }
  }
  return hidden;
};
