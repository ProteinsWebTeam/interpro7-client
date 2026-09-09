import { scaleLinear } from 'd3-scale';
import { Node as VisNode } from 'vis-network';

import {
  getClanStatus,
  STATUS_COLOR,
  STATUS_HIGHLIGHT_BORDER,
} from './colorPalette';
import { EllipseRenderer } from './ellipseNode';
import { FilterKey, statusKey, typeKey } from './filterKeys';
import { ClanNetworkNode } from './types';

// Keyed on InterPro's own entry-type vocabulary (lowercase snake_case, see
// src/components/Entry/EntryListFilters/EntryTypeFilter), not Pfam's own
// (capitalized) type strings that the reference curator tool used. The API
// lower-cases to the same keys, but note the separator differs from that tool:
// it sends `Coiled_coil`, not `Coiled-coil`.
//
// Only the Pfam types can actually occur here -- the viewer is rendered for
// Pfam clans alone -- so `homologous_superfamily` shares the hexagon with
// `disordered` without ever colliding with it.
export const SHAPE_BY_TYPE: Record<string, string> = {
  family: 'dot',
  domain: 'square',
  repeat: 'triangle',
  coiled_coil: 'ellipse',
  disordered: 'hexagon',
  conserved_site: 'diamond',
  active_site: 'star',
  binding_site: 'triangleDown',
  ptm: 'box',
};
export const DEFAULT_SHAPE = 'dot';

export const getShapeForType = (type?: string): string =>
  SHAPE_BY_TYPE[type?.toLowerCase() || ''] || DEFAULT_SHAPE;
export const getNodeLabel = (node: ClanNetworkNode): string =>
  node.short_name || node.accession;

const MIN_NODE_SIZE = 10;
const MAX_NODE_SIZE = 40;
const BASE_FONT_SIZE = 20;

// A white halo keeps labels readable where they cross an edge or a
// neighbouring node -- vis-network draws none by default.
export const labelFont = (fontSize: number) => ({
  size: fontSize,
  strokeWidth: 3,
  strokeColor: '#ffffff',
});

// SHAPE_BY_TYPE names shapes semantically; `ellipse` is the one vis-network
// cannot size from `size`, so it is drawn as a custom shape instead. See
// ellipseNode.ts.
const toVisShape = (
  shape: string,
  ctxRenderer: EllipseRenderer,
): { shape: string; ctxRenderer?: EllipseRenderer } =>
  shape === 'ellipse' ? { shape: 'custom', ctxRenderer } : { shape };

export type ClanVisNode = VisNode & {
  id: string;
  baseSize: number;
  baseFontSize: number;
  ctxRenderer?: EllipseRenderer;
  filterKeys: Array<FilterKey>;
};

// A node answers to its clan membership status and to its entry type. Exported
// because nodeVisibility.ts asks the same question of the raw API nodes, which
// carry no `filterKeys` of their own to read the answer off.
export const nodeFilterKeys = (
  node: ClanNetworkNode,
  currentClanAccession: string,
): Array<FilterKey> => [
  statusKey(getClanStatus(node, currentClanAccession)),
  typeKey(node.type),
];

const buildNodeTooltip = (
  node: ClanNetworkNode,
  currentClanAccession: string,
): HTMLElement => {
  const el = document.createElement('div');
  const status = getClanStatus(node, currentClanAccession);
  el.innerHTML = `
    <strong>${node.short_name}</strong> (${node.accession})<br/>
    Type: ${node.type}<br/>
    Length: ${node.score}<br/>
    Clan: ${node.clan ?? 'none'} ${
      status === 'current-clan' ? '(this clan)' : ''
    }<br/>
    ${node.name}
  `;
  return el;
};

export const buildNodes = (
  nodes: Array<ClanNetworkNode>,
  currentClanAccession: string,
  positions: Record<string, { x: number; y: number }>,
  ellipseRenderer: EllipseRenderer,
): Array<ClanVisNode> => {
  const scores = nodes.map((node) => node.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const sizeScale = scaleLinear()
    .domain(minScore === maxScore ? [0, maxScore || 1] : [minScore, maxScore])
    .range([MIN_NODE_SIZE, MAX_NODE_SIZE])
    .clamp(true);

  return nodes.map((node) => {
    const status = getClanStatus(node, currentClanAccession);
    const color = STATUS_COLOR[status];
    const baseSize = sizeScale(node.score);
    const position = positions[node.accession];

    return {
      id: node.accession,
      ...toVisShape(getShapeForType(node.type), ellipseRenderer),
      label: getNodeLabel(node),
      color: {
        background: color.background,
        border: color.border,
        highlight: {
          background: color.highlight,
          border: STATUS_HIGHLIGHT_BORDER,
        },
      },
      size: baseSize,
      baseSize,
      baseFontSize: BASE_FONT_SIZE,
      font: labelFont(BASE_FONT_SIZE),
      filterKeys: nodeFilterKeys(node, currentClanAccession),
      title: buildNodeTooltip(node, currentClanAccession),
      ...(position ? { x: position.x, y: position.y, fixed: true } : undefined),
    };
  });
};
