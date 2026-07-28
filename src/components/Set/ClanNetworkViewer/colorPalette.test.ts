import { getClanStatus, getEdgeStyle, getMethodColor } from './colorPalette';
import { ClanNetworkNode } from './types';

const node = (clan?: string): ClanNetworkNode => ({
  accession: 'PF00001',
  short_name: 'test',
  name: 'Test family',
  type: 'Domain',
  score: 100,
  clan,
});

describe('getClanStatus', () => {
  test('is "current-clan" when the node belongs to the clan being viewed', () => {
    expect(getClanStatus(node('CL0001'), 'CL0001')).toBe('current-clan');
  });

  test('is "other-clan" when the node belongs to a different clan', () => {
    expect(getClanStatus(node('CL0002'), 'CL0001')).toBe('other-clan');
  });

  test('is "no-clan" when the node has no clan', () => {
    expect(getClanStatus(node(undefined), 'CL0001')).toBe('no-clan');
  });
});

describe('getMethodColor', () => {
  test('is deterministic for the same method', () => {
    expect(getMethodColor('hmm')).toBe(getMethodColor('hmm'));
  });

  test('differs for different methods (in general)', () => {
    expect(getMethodColor('hmm')).not.toBe(getMethodColor('foldseek'));
  });

  test('falls back to a stable color when method is missing', () => {
    expect(getMethodColor(undefined)).toBe(getMethodColor(undefined));
  });
});

describe('getEdgeStyle', () => {
  test('foldseek: lower E-value is a thicker, stronger-colored edge', () => {
    expect(getEdgeStyle('foldseek', 1e-12)).toEqual({
      color: '#0072b2',
      width: 3,
    });
    expect(getEdgeStyle('foldseek', 1e-7)).toEqual({
      color: '#3a8fc7',
      width: 2,
    });
    expect(getEdgeStyle('foldseek', 1e-3)).toEqual({
      color: '#56b4e9',
      width: 1,
    });
  });

  test('hhsearch tiers match the reference thresholds', () => {
    expect(getEdgeStyle('hhsearch', 1e-11)).toEqual({
      color: '#d55e00',
      width: 3,
    });
    expect(getEdgeStyle('HHSEARCH', 9.1e-3)).toEqual({
      color: '#e69f00',
      width: 1,
    });
  });

  test('dali: higher Z-score is a thicker, stronger-colored edge', () => {
    expect(getEdgeStyle('dali', 25)).toEqual({ color: '#cc79a7', width: 3 });
    expect(getEdgeStyle('dali', 15)).toEqual({ color: '#d896bc', width: 2 });
    expect(getEdgeStyle('dali', 9.4)).toEqual({ color: '#e4b3d1', width: 1 });
  });

  test('scoop: higher score is a thicker, stronger-colored edge', () => {
    expect(getEdgeStyle('scoop', 150)).toEqual({
      color: '#009e73',
      width: 3,
    });
    expect(getEdgeStyle('scoop', 50)).toEqual({ color: '#00b883', width: 2 });
    expect(getEdgeStyle('scoop', 5)).toEqual({ color: '#00d9a3', width: 1 });
  });

  test('falls back to the method hash color for unknown methods', () => {
    expect(getEdgeStyle('hmm', 42)).toEqual({
      color: getMethodColor('hmm'),
      width: 1,
    });
    expect(getEdgeStyle(undefined, 42)).toEqual({
      color: getMethodColor(undefined),
      width: 1,
    });
  });
});
