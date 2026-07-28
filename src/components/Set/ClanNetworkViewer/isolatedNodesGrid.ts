import { ClanNetworkLink, ClanNetworkNode } from './types';

const GRID_COLS = 4;
const GRID_SPACING = 80;
const GRID_OFFSET_X = 600;

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
  isolatedAccessions.forEach((accession, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    positions[accession] = {
      x: GRID_OFFSET_X + col * GRID_SPACING,
      y: row * GRID_SPACING,
    };
  });
  return positions;
};
