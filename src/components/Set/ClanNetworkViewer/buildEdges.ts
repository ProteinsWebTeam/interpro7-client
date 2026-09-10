import { Edge as VisEdge } from 'vis-network';

import { getEdgeStyle, getEdgeTierIndex, getMethodLabel } from './colorPalette';
import { FilterKey, methodKey, NESTED_KEY, tierKey } from './filterKeys';
import { formatScore, getScoreLabel } from './scoreLabel';
import { ClanNetworkLink, ClanNetworkNode } from './types';

// Every edge gets at least a slight curve, matching the reference curator
// visualisation -- straight lines between a dense hub's neighbours overlap
// each other badly, and a constant bow makes them individually traceable.
const BASE_ROUNDNESS = 0.1;
const CURVATURE_STEP = 0.15;
const MAX_ROUNDNESS = 0.5;

type Smooth = {
  enabled: true;
  type: 'curvedCW' | 'curvedCCW';
  roundness: number;
};

const pairKey = (source: string, target: string): string =>
  [source, target].sort().join('|');

// Parallel edges (the same family pair supported by several methods) fan out
// symmetrically around BASE_ROUNDNESS so none of them are drawn on top of
// each other.
export const curvatureFor = (
  indexInGroup: number,
  groupSize: number,
): Smooth => {
  const offsetFromCenter = indexInGroup - (groupSize - 1) / 2;
  return {
    enabled: true,
    type: offsetFromCenter > 0 ? 'curvedCW' : 'curvedCCW',
    roundness: Math.min(
      MAX_ROUNDNESS,
      BASE_ROUNDNESS + Math.abs(offsetFromCenter) * CURVATURE_STEP,
    ),
  };
};

const buildEdgeTooltip = (
  link: ClanNetworkLink,
  sourceLabel: string,
  targetLabel: string,
): HTMLElement => {
  const el = document.createElement('div');
  el.innerHTML = `
    <strong>${getMethodLabel(link.method)}</strong><br/>
    ${getScoreLabel(link.method)}: ${formatScore(link.score)}<br/>
    Between:<br/>
    ${sourceLabel}<br/>
    ${targetLabel}
    ${link.nested ? '<br/><strong>Nested domain relationship</strong>' : ''}
  `;
  return el;
};

// What a selected node's edges turn to by default, so they stand out from the
// rest. Focus mode swaps it for each edge's own `baseColor` (see index.tsx):
// with only one node's edges on the canvas there is nothing to stand out from,
// and black would hide the method and strength the colours encode.
export const EDGE_HIGHLIGHT_COLOR = '#000000';

export type ClanVisEdge = VisEdge & {
  baseColor: string;
  filterKeys: Array<FilterKey>;
};

// An edge answers to its method, to its strength tier within that method, and
// to `nested` when it is one, so the legend can switch off any of the three.
// Exported for nodeVisibility.ts, which applies the same test to the raw links.
export const edgeFilterKeys = (link: ClanNetworkLink): Array<FilterKey> => {
  const tierIndex = getEdgeTierIndex(link.method, link.score);
  return [
    methodKey(link.method),
    ...(tierIndex === null ? [] : [tierKey(link.method as string, tierIndex)]),
    ...(link.nested ? [NESTED_KEY] : []),
  ];
};

export const buildEdges = (
  links: Array<ClanNetworkLink>,
  nodes: Array<ClanNetworkNode>,
): Array<ClanVisEdge> => {
  const nodeByAccession = new Map(nodes.map((node) => [node.accession, node]));

  const groups = new Map<string, Array<ClanNetworkLink>>();
  for (const link of links) {
    const key = pairKey(link.source, link.target);
    const group = groups.get(key) || [];
    group.push(link);
    groups.set(key, group);
  }

  const edges: Array<ClanVisEdge> = [];
  for (const group of groups.values()) {
    group.forEach((link, index) => {
      const sourceNode = nodeByAccession.get(link.source);
      const targetNode = nodeByAccession.get(link.target);
      const sourceLabel = sourceNode
        ? `${sourceNode.short_name} (${sourceNode.accession})`
        : link.source;
      const targetLabel = targetNode
        ? `${targetNode.short_name} (${targetNode.accession})`
        : link.target;

      const { color, width } = getEdgeStyle(link.method, link.score);

      edges.push({
        id: `${link.source}-${link.target}-${
          link.method || 'unknown'
        }-${index}`,
        from: link.source,
        to: link.target,
        color: { color, highlight: EDGE_HIGHLIGHT_COLOR },
        baseColor: color,
        width,
        dashes: Boolean(link.nested),
        smooth: curvatureFor(index, group.length),
        title: buildEdgeTooltip(link, sourceLabel, targetLabel),
        filterKeys: edgeFilterKeys(link),
      });
    });
  }
  return edges;
};
