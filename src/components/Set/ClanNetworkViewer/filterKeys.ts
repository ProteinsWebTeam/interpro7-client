// Every legend entry toggles one key. Nodes and edges are tagged with the keys
// that describe them when they are built, so filtering is a set-membership test
// rather than a second copy of the legend's classification rules.
//
// A node carries its membership status and its entry type; an edge carries its
// method, its strength tier within that method, and `nested` when it is one.
// For a method with tiers, the legend's method entry works through the tier
// keys (all of them at once), so what the tiers show is always what is hidden;
// the method key is only toggled for methods with no tiers of their own.

export type FilterKey = string;

export const statusKey = (status: string): FilterKey => `status:${status}`;

export const typeKey = (type: string): FilterKey => `type:${type}`;

export const methodKey = (method?: string): FilterKey =>
  `method:${(method || 'unknown').toLowerCase()}`;

export const tierKey = (method: string, tierIndex: number): FilterKey =>
  `tier:${method.toLowerCase()}:${tierIndex}`;

export const NESTED_KEY: FilterKey = 'nested';

export const isFilteredOut = (
  keys: Array<FilterKey> | undefined,
  disabled: Set<FilterKey>,
): boolean =>
  disabled.size > 0 && (keys || []).some((key) => disabled.has(key));

// Toggles a group of keys as one: if they are all off they all come back on,
// otherwise they all go off -- so a method with only some tiers hidden is
// switched off entirely by its first click, not flipped tier by tier.
export const toggleKeys = (
  disabled: Set<FilterKey>,
  keys: Array<FilterKey>,
): Set<FilterKey> => {
  const next = new Set(disabled);
  const allOff = keys.every((key) => disabled.has(key));
  keys.forEach((key) => (allOff ? next.delete(key) : next.add(key)));
  return next;
};
