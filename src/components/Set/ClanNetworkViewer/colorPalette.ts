import ColorHash from 'color-hash';

import { ClanMembershipStatus, ClanNetworkNode } from './types';

// Deterministic string -> color, same approach as src/utils/entry-color, used
// as a fallback for any `method` value outside the 4 known ones below so an
// arbitrary/unknown number of distinct methods still gets a stable color
// without hardcoding their names.
const methodColorHash = new ColorHash({
  saturation: [0.65, 0.35, 0.5],
  lightness: [0.5, 0.4, 0.6],
});

export const STATUS_COLOR: Record<
  ClanMembershipStatus,
  { background: string; border: string; highlight: string }
> = {
  'current-clan': {
    background: '#4caf50',
    border: '#2e7d32',
    highlight: '#4caf50',
  },
  'other-clan': {
    background: '#f44336',
    border: '#c62828',
    highlight: '#f44336',
  },
  'no-clan': {
    background: '#bdbdbd',
    border: '#757575',
    highlight: '#bdbdbd',
  },
};

// On hover/select, keep the fill and swap the border to black (matches the
// reference curator tool's highlight treatment) rather than lightening the
// fill, which reads poorly against the light theme's canvas background.
export const STATUS_HIGHLIGHT_BORDER = '#000000';

export type EdgeTier = { color: string; width: number };

type ScoreTier = { color: string; width: number } & (
  | { max: number }
  | { min: number }
);

// Thresholds and colors mirror the reference curator visualisation script
// (visualise_clan_network.py) exactly: 3 significance tiers per comparison
// method, using a colorblind-safe palette distinct per method. These are
// purely a styling/legend concern -- edges reaching the frontend have
// already passed whatever inclusion threshold the backend/pipeline applied;
// these tiers just bucket the *strength* of an already-included match.
const EDGE_TIERS: Record<string, Array<ScoreTier>> = {
  // E-value: lower is stronger.
  foldseek: [
    { max: 1e-10, color: '#0072b2', width: 3 },
    { max: 1e-5, color: '#3a8fc7', width: 2 },
    { max: Infinity, color: '#56b4e9', width: 1 },
  ],
  hhsearch: [
    { max: 1e-10, color: '#d55e00', width: 3 },
    { max: 1e-5, color: '#dd7e33', width: 2 },
    { max: Infinity, color: '#e69f00', width: 1 },
  ],
  // Z-score / profile score: higher is stronger.
  dali: [
    { min: 20, color: '#cc79a7', width: 3 },
    { min: 12, color: '#d896bc', width: 2 },
    { min: -Infinity, color: '#e4b3d1', width: 1 },
  ],
  scoop: [
    { min: 100, color: '#009e73', width: 3 },
    { min: 30, color: '#00b883', width: 2 },
    { min: -Infinity, color: '#00d9a3', width: 1 },
  ],
};

// Legend copy for the 4 known methods, in the same tier order as
// EDGE_TIERS, worded after the reference tool's legend.
export const METHOD_LEGEND: Array<{
  method: string;
  label: string;
  tiers: Array<{ label: string; color: string }>;
}> = [
  {
    method: 'foldseek',
    label: 'Foldseek (structural)',
    tiers: [
      { label: 'E-value < 1e-10', color: EDGE_TIERS.foldseek[0].color },
      { label: 'E-value 1e-10 to 1e-5', color: EDGE_TIERS.foldseek[1].color },
      { label: 'E-value ≥ 1e-5', color: EDGE_TIERS.foldseek[2].color },
    ],
  },
  {
    method: 'dali',
    label: 'DALI (structural)',
    tiers: [
      { label: 'Z-score ≥ 20', color: EDGE_TIERS.dali[0].color },
      { label: 'Z-score 12 to 20', color: EDGE_TIERS.dali[1].color },
      { label: 'Z-score < 12', color: EDGE_TIERS.dali[2].color },
    ],
  },
  {
    method: 'hhsearch',
    label: 'HHsearch (profile)',
    tiers: [
      { label: 'E-value < 1e-10', color: EDGE_TIERS.hhsearch[0].color },
      { label: 'E-value 1e-10 to 1e-5', color: EDGE_TIERS.hhsearch[1].color },
      { label: 'E-value ≥ 1e-5', color: EDGE_TIERS.hhsearch[2].color },
    ],
  },
  {
    method: 'scoop',
    label: 'SCOOP (profile-profile)',
    tiers: [
      { label: 'Score > 100', color: EDGE_TIERS.scoop[0].color },
      { label: 'Score 30 to 100', color: EDGE_TIERS.scoop[1].color },
      { label: 'Score < 30', color: EDGE_TIERS.scoop[2].color },
    ],
  },
];

export const STATUS_LABEL: Record<ClanMembershipStatus, string> = {
  'current-clan': 'This clan',
  'other-clan': 'Other clan',
  'no-clan': 'No clan',
};

export const getClanStatus = (
  node: ClanNetworkNode,
  currentClanAccession: string,
): ClanMembershipStatus => {
  if (!node.clan) return 'no-clan';
  return node.clan === currentClanAccession ? 'current-clan' : 'other-clan';
};

export const getMethodColor = (method: string | undefined): string =>
  methodColorHash.hex(method || 'unknown');

// Display name for a method: the legend's wording for the known ones, the
// raw value for anything else so an unexpected method is still identifiable.
export const getMethodLabel = (method?: string): string =>
  METHOD_LEGEND.find((entry) => entry.method === method?.toLowerCase())
    ?.label ||
  method ||
  'Unknown method';

const matchesTier = (tier: ScoreTier, score: number): boolean =>
  'max' in tier ? score < tier.max : score >= tier.min;

// Edge color + width for a given method/score pair. Known methods use the
// fixed reference tiers above; anything else falls back to the hash color
// at the thinnest (weak) width, since we have no strength convention for it.
export const getEdgeStyle = (
  method: string | undefined,
  score: number,
): EdgeTier => {
  const tiers = method && EDGE_TIERS[method.toLowerCase()];
  if (!tiers) return { color: getMethodColor(method), width: 1 };
  const { color, width } =
    tiers.find((tier) => matchesTier(tier, score)) || tiers[tiers.length - 1];
  return { color, width };
};
