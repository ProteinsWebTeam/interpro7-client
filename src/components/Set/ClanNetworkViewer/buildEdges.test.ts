import { buildEdges, curvatureFor } from './buildEdges';
import { ClanNetworkLink, ClanNetworkNode } from './types';

describe('curvatureFor', () => {
  test('a lone edge still gets the baseline curve', () => {
    expect(curvatureFor(0, 1)).toEqual({
      enabled: true,
      type: 'curvedCCW',
      roundness: 0.1,
    });
  });

  test('the middle edge of an odd-sized group keeps the baseline curve', () => {
    expect(curvatureFor(1, 3).roundness).toBeCloseTo(0.1);
  });

  test('edges fan out symmetrically around the center', () => {
    const before = curvatureFor(0, 3);
    const after = curvatureFor(2, 3);
    expect(before.type).not.toBe(after.type);
    expect(before.roundness).toBeCloseTo(after.roundness);
  });

  test('parallel edges are separated enough to be visually distinct', () => {
    const [first, second] = [curvatureFor(0, 2), curvatureFor(1, 2)];
    expect(first.type).not.toBe(second.type);
    // Bowed opposite ways, so the gap between them is the sum of both.
    expect(first.roundness + second.roundness).toBeGreaterThan(0.3);
  });

  test('roundness never exceeds the configured maximum for large groups', () => {
    expect(curvatureFor(9, 10).roundness).toBeLessThanOrEqual(0.5);
  });
});

describe('buildEdges', () => {
  const nodes: Array<ClanNetworkNode> = [
    { accession: 'PF1', short_name: 'a', name: 'A', type: 'Domain', score: 1 },
    { accession: 'PF2', short_name: 'b', name: 'B', type: 'Domain', score: 1 },
  ];

  test('builds one vis-network edge per link', () => {
    const links: Array<ClanNetworkLink> = [
      { source: 'PF1', target: 'PF2', score: 0.5, method: 'hmm' },
    ];
    const edges = buildEdges(links, nodes);
    expect(edges).toHaveLength(1);
    expect(edges[0].from).toBe('PF1');
    expect(edges[0].to).toBe('PF2');
    expect(edges[0].dashes).toBe(false);
  });

  test('colors and widths an edge from its method-specific significance tier', () => {
    const links: Array<ClanNetworkLink> = [
      { source: 'PF1', target: 'PF2', score: 1e-12, method: 'foldseek' },
    ];
    const edges = buildEdges(links, nodes);
    expect(edges[0].color).toEqual({
      color: '#0072b2',
      highlight: '#000000',
    });
    expect(edges[0].width).toBe(3);
  });

  test('marks nested links as dashed', () => {
    const links: Array<ClanNetworkLink> = [
      { source: 'PF1', target: 'PF2', score: 0.5, nested: true },
    ];
    const edges = buildEdges(links, nodes);
    expect(edges[0].dashes).toBe(true);
  });

  test('assigns distinct, non-overlapping curvature to parallel edges between the same pair', () => {
    const links: Array<ClanNetworkLink> = [
      { source: 'PF1', target: 'PF2', score: 0.5, method: 'foldseek' },
      { source: 'PF1', target: 'PF2', score: 0.5, method: 'hhsearch' },
      { source: 'PF2', target: 'PF1', score: 0.5, method: 'scoop' },
    ];
    const edges = buildEdges(links, nodes);
    expect(edges).toHaveLength(3);
    const ids = new Set(edges.map((edge) => edge.id));
    expect(ids.size).toBe(3);
  });
});
