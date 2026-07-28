import { getIsolatedAccessions, placeIsolatedNodes } from './isolatedNodesGrid';
import { ClanNetworkLink, ClanNetworkNode } from './types';

const node = (accession: string): ClanNetworkNode => ({
  accession,
  short_name: accession,
  name: accession,
  type: 'Domain',
  score: 100,
});

const link = (source: string, target: string): ClanNetworkLink => ({
  source,
  target,
  score: 1,
});

describe('getIsolatedAccessions', () => {
  test('returns nodes that have no edges', () => {
    const nodes = [node('PF1'), node('PF2'), node('PF3')];
    const links = [link('PF1', 'PF2')];
    expect(getIsolatedAccessions(nodes, links)).toEqual(['PF3']);
  });

  test('returns nothing when every node has an edge', () => {
    const nodes = [node('PF1'), node('PF2')];
    const links = [link('PF1', 'PF2')];
    expect(getIsolatedAccessions(nodes, links)).toEqual([]);
  });

  test('returns every node when there are no links', () => {
    const nodes = [node('PF1'), node('PF2')];
    expect(getIsolatedAccessions(nodes, [])).toEqual(['PF1', 'PF2']);
  });
});

describe('placeIsolatedNodes', () => {
  test('assigns a distinct position to every isolated accession', () => {
    const positions = placeIsolatedNodes(['PF1', 'PF2', 'PF3']);
    expect(Object.keys(positions)).toEqual(['PF1', 'PF2', 'PF3']);
    const coords = Object.values(positions).map(({ x, y }) => `${x},${y}`);
    expect(new Set(coords).size).toBe(3);
  });

  test('returns an empty map for no isolated nodes', () => {
    expect(placeIsolatedNodes([])).toEqual({});
  });
});
