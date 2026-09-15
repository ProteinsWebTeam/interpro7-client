import { ClanNetworkLink, ClanNetworkNode } from './types';

const GRID_COLS = 4;
const GRID_SPACING = 100;
// Where the block waits while the physics engine settles the connected graph:
// far enough out that these fixed nodes cannot pull the layout out of shape.
// Only ever a starting position -- once the graph has settled and there is
// something to measure, the grid is moved in beside it (see gridCentreBeside).
const GRID_STAGING_X = -1500;
// The clear space left between the network's left edge and the grid's
// right-hand column: a wide enough band that the block reads as separate from
// the network -- and clears the radius of the largest node on that edge, which
// is measured from its centre -- without stranding it off in the distance.
const GRID_GAP = 700;

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

// Where to centre the block so that it sits just outside the network's left
// edge and level with its middle. How wide the block is for a given number of
// nodes, and how much room to leave beside the network, both stay in here: the
// caller only has to say where the network actually is. Measuring it rather
// than assuming it is what keeps the grid the same short distance away whether
// the clan settled into a tight cluster or a sprawl.
export const gridCentreBeside = (
  count: number,
  networkLeftX: number,
  networkCentreY: number,
): { x: number; y: number } => ({
  x:
    networkLeftX -
    GRID_GAP -
    ((Math.min(count, GRID_COLS) - 1) * GRID_SPACING) / 2,
  y: networkCentreY,
});

export const placeIsolatedNodes = (
  isolatedAccessions: Array<string>,
  // Where to centre the block, in the network's own coordinates: beside the
  // network (see gridCentreBeside), or the middle of the view once the filters
  // have left no network to sit beside. Left out only before the graph has
  // settled, when there is nothing to measure yet and the block stages itself
  // off to the left.
  centre?: { x: number; y: number } | null,
): Record<string, { x: number; y: number }> => {
  const positions: Record<string, { x: number; y: number }> = {};
  const rowCount = Math.ceil(isolatedAccessions.length / GRID_COLS);
  // Rows straddle the centre line, so the block sits level with whatever it is
  // placed beside rather than hanging below it.
  const firstRowY = (centre?.y || 0) - ((rowCount - 1) * GRID_SPACING) / 2;
  // A grid of fewer nodes than one full row uses only as many columns as it has
  // nodes, and that is what both the right edge and the centring measure from.
  const colCount = Math.min(isolatedAccessions.length, GRID_COLS);
  // Centred, the columns straddle the centre the way the rows do.
  const rightEdgeX = centre
    ? centre.x + ((colCount - 1) * GRID_SPACING) / 2
    : GRID_STAGING_X;
  isolatedAccessions.forEach((accession, i) => {
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    positions[accession] = {
      x: rightEdgeX - (colCount - 1 - col) * GRID_SPACING,
      y: firstRowY + row * GRID_SPACING,
    };
  });
  return positions;
};
