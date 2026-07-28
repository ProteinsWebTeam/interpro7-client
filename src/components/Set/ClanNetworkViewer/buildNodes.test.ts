import { buildNodes } from './buildNodes';
import { ClanNetworkNode } from './types';

const label: LabelUISettings = { accession: false, name: false, short: true };

const node = (overrides: Partial<ClanNetworkNode> = {}): ClanNetworkNode => ({
  accession: 'PF00001',
  short_name: 'test',
  name: 'Test family',
  type: 'domain',
  score: 100,
  ...overrides,
});

describe('buildNodes', () => {
  // These are InterPro's own entry-type strings (lowercase snake_case, see
  // src/components/Entry/EntryListFilters/EntryTypeFilter), which is what
  // pfam.get_relationships() actually populates node.type with in
  // production -- NOT Pfam's own (capitalized) type vocabulary.
  test('maps every known InterPro entry type to a distinct vis-network shape', () => {
    const nodes = [
      node({ accession: 'PF1', type: 'domain' }),
      node({ accession: 'PF2', type: 'family' }),
      node({ accession: 'PF3', type: 'homologous_superfamily' }),
      node({ accession: 'PF4', type: 'repeat' }),
      node({ accession: 'PF5', type: 'conserved_site' }),
      node({ accession: 'PF6', type: 'active_site' }),
      node({ accession: 'PF7', type: 'binding_site' }),
      node({ accession: 'PF8', type: 'ptm' }),
    ];
    const built = buildNodes(nodes, 'CL0001', label, {});
    const shapes = built.map((n) => n.shape);
    expect(shapes).toEqual([
      'square',
      'dot',
      'hexagon',
      'triangle',
      'diamond',
      'star',
      'triangleDown',
      'box',
    ]);
    expect(new Set(shapes).size).toBe(nodes.length);
  });

  test('is case-insensitive on the type string', () => {
    const built = buildNodes(
      [node({ type: 'Domain' }), node({ accession: 'PF2', type: 'DOMAIN' })],
      'CL0001',
      label,
      {},
    );
    expect(built.map((n) => n.shape)).toEqual(['square', 'square']);
  });

  test('falls back to "dot" for an unrecognized type', () => {
    const built = buildNodes(
      [node({ type: 'SomethingNew' })],
      'CL0001',
      label,
      {},
    );
    expect(built[0].shape).toBe('dot');
  });

  test('positions and fixes only isolated nodes', () => {
    const built = buildNodes(
      [node({ accession: 'PF1' }), node({ accession: 'PF2' })],
      'CL0001',
      label,
      { PF1: { x: 10, y: 20 } },
    );
    const [pf1, pf2] = built;
    expect(pf1.fixed).toBe(true);
    expect(pf1.x).toBe(10);
    expect(pf1.y).toBe(20);
    expect(pf2.fixed).toBeUndefined();
  });

  test('scales node size between a minimum and maximum based on score', () => {
    const built = buildNodes(
      [
        node({ accession: 'PF1', score: 10 }),
        node({ accession: 'PF2', score: 1000 }),
      ],
      'CL0001',
      label,
      {},
    );
    const [small, large] = built;
    expect(small.baseSize).toBeLessThan(large.baseSize);
  });

  test('does not divide by zero when every node has the same score', () => {
    const built = buildNodes(
      [
        node({ accession: 'PF1', score: 50 }),
        node({ accession: 'PF2', score: 50 }),
      ],
      'CL0001',
      label,
      {},
    );
    expect(built.every((n) => Number.isFinite(n.baseSize))).toBe(true);
  });
});
