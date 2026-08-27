import { ClanNetworkLink, ClanNetworkNode } from './types';

const GRID_COLS = 4;
const GRID_SPACING = 100;
// Isolated nodes go in a grid to the *left* of the connected graph, which the
// physics engine settles around the origin. The grid grows leftwards from
// this right edge, kept far enough out that a spread-out cluster doesn't
// reach into it.
const GRID_RIGHT_EDGE_X = -1500;

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
