// What a link's `score` actually *is* depends on the comparison method that
// produced it, so tooltips and the legend label it accordingly rather than
// calling everything "Score".
const SCORE_LABEL_BY_METHOD: Record<string, string> = {
  foldseek: 'E-value',
  dali: 'Z-score',
  hhsearch: 'E-value',
  scoop: 'Score',
};
const DEFAULT_SCORE_LABEL = 'Score';

export const getScoreLabel = (method?: string): string =>
  SCORE_LABEL_BY_METHOD[method?.toLowerCase() || ''] || DEFAULT_SCORE_LABEL;

// "1.20e-10" -> "1.2e-10", "5.00" -> "5"
const trimTrailingZeros = (formatted: string): string =>
  formatted.replace(/\.?0+(e|$)/, '$1');

// Two decimals at most. E-values reach 1e-30, which fixed notation would
// render as "0.00", so small (and very large) magnitudes switch to
// exponential notation.
export const formatScore = (score: number): string => {
  if (!Number.isFinite(score)) return String(score);
  const magnitude = Math.abs(score);
  const formatted =
    magnitude !== 0 && (magnitude < 0.01 || magnitude >= 1e5)
      ? score.toExponential(2)
      : score.toFixed(2);
  return trimTrailingZeros(formatted);
};
