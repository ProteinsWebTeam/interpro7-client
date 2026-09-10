import { BoundingBox, Network } from 'vis-network';

import { ClanNetworkLink, ClanNetworkNode } from './types';

const GRID_COLS = 4;
const GRID_SPACING = 100;
// Isolated nodes go in a grid to the *left* of the connected graph, which the
// physics engine settles around the origin. The grid grows leftwards from
// this right edge, kept far enough out that a spread-out cluster doesn't
// reach into it.
const GRID_RIGHT_EDGE_X = -1500;

// The frame drawn around the grid: room between it and the nodes, and the
// heading's size relative to the node labels.
const FRAME_PADDING = 30;
const HEADING_SCALE = 1.5;
const FRAME_FILL = '#f7f7f7';
const FRAME_BORDER = '#d6d6d6';
const HEADING_COLOR = '#343434';
export const ISOLATED_NODES_LABEL = 'Unconnected entries';

export const getConnectedAccessions = (
  links: Array<ClanNetworkLink>,
): Set<string> => {
  const connected = new Set<string>();
  for (const link of links) {
    connected.add(link.source);
    connected.add(link.target);
  }
  return connected;
};

export const getIsolatedAccessions = (
  nodes: Array<ClanNetworkNode>,
  links: Array<ClanNetworkLink>,
): Array<string> => {
  const connected = getConnectedAccessions(links);
  return nodes
    .map((node) => node.accession)
    .filter((accession) => !connected.has(accession));
};

export const placeIsolatedNodes = (
  isolatedAccessions: Array<string>,
): Record<string, { x: number; y: number }> => {
  const positions: Record<string, { x: number; y: number }> = {};
  const rowCount = Math.ceil(isolatedAccessions.length / GRID_COLS);
  // Rows straddle y = 0 so the block sits level with the connected graph
  // rather than hanging below it.
  const firstRowY = (-(rowCount - 1) * GRID_SPACING) / 2;
  isolatedAccessions.forEach((accession, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    positions[accession] = {
      x: GRID_RIGHT_EDGE_X - (GRID_COLS - 1 - col) * GRID_SPACING,
      y: firstRowY + row * GRID_SPACING,
    };
  });
  return positions;
};

// The area the visible isolated nodes (labels included) take up, measured off
// the network rather than worked out from placeIsolatedNodes: vis-network's
// layout recentres *every* node once it has placed the graph, fixed ones
// included, so the grid never ends up quite where it was put.
//
// Each node is measured at its `home` -- where it sat once the layout settled
// -- with its current size, so the frame keeps up with the size sliders but a
// node dragged out of the grid doesn't stretch the frame after it.
export const getIsolatedGridBounds = (
  network: Network,
  homes: Record<string, { x: number; y: number }>,
  hidden: Set<string>,
): BoundingBox | null => {
  const visible = Object.keys(homes).filter((id) => !hidden.has(id));
  if (!visible.length) return null;
  const current = network.getPositions(visible);
  const bounds = {
    top: Infinity,
    left: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  };
  for (const id of visible) {
    const box = network.getBoundingBox(id);
    const dx = homes[id].x - current[id].x;
    const dy = homes[id].y - current[id].y;
    bounds.top = Math.min(bounds.top, box.top + dy);
    bounds.left = Math.min(bounds.left, box.left + dx);
    bounds.right = Math.max(bounds.right, box.right + dx);
    bounds.bottom = Math.max(bounds.bottom, box.bottom + dy);
  }
  return bounds;
};

// A light box around the grid, headed by what it holds, so those nodes read as
// "no relationships found" rather than as a stray corner of the graph.
//
// Drawn from `afterDrawing`, whose context is already in network coordinates,
// so it pans and zooms with the grid. That hook runs after the nodes are
// drawn: the border and heading go on top, and the fill is put *behind*
// everything with `destination-over` so it doesn't cover the nodes.
export const drawIsolatedGridFrame = (
  ctx: CanvasRenderingContext2D,
  bounds: BoundingBox,
  fontSize: number,
  viewScale: number,
) => {
  const headingSize = fontSize * HEADING_SCALE;
  const left = bounds.left - FRAME_PADDING;
  const right = bounds.right + FRAME_PADDING;
  const top = bounds.top - FRAME_PADDING - headingSize * 1.5;
  const bottom = bounds.bottom + FRAME_PADDING;

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, right - left, bottom - top);
  // Kept one pixel wide on screen whatever the zoom.
  ctx.lineWidth = 1 / viewScale;
  ctx.strokeStyle = FRAME_BORDER;
  ctx.stroke();

  ctx.font = `bold ${headingSize}px arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = HEADING_COLOR;
  ctx.fillText(
    ISOLATED_NODES_LABEL,
    (left + right) / 2,
    top + headingSize * 0.5,
  );

  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = FRAME_FILL;
  ctx.fillRect(left, top, right - left, bottom - top);
  ctx.restore();
};
