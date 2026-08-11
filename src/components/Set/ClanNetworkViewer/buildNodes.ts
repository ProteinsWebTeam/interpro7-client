import { scaleLinear } from 'd3-scale';
import { Node as VisNode } from 'vis-network';

import {
  getClanStatus,
  STATUS_COLOR,
  STATUS_HIGHLIGHT_BORDER,
} from './colorPalette';
import { ClanNetworkNode } from './types';

// Keyed on InterPro's own entry-type vocabulary (lowercase snake_case, see
// src/components/Entry/EntryListFilters/EntryTypeFilter), not Pfam's own
// (capitalized) type strings that the reference curator tool used.
export const SHAPE_BY_TYPE: Record<string, string> = {
  domain: 'square',
  family: 'dot',
  homologous_superfamily: 'hexagon',
  repeat: 'triangle',
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
const BASE_FONT_SIZE = 14;

export type ClanVisNode = VisNode & {
  id: string;
  baseSize: number;
  baseFontSize: number;
};

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
      shape: getShapeForType(node.type),
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
      font: { size: BASE_FONT_SIZE },
      title: buildNodeTooltip(node, currentClanAccession),
      ...(position ? { x: position.x, y: position.y, fixed: true } : undefined),
    };
  });
};
