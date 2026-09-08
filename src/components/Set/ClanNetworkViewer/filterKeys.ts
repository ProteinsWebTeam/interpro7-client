// Every legend entry toggles one key. Nodes and edges are tagged with the keys
// that describe them when they are built, so filtering is a set-membership test
// rather than a second copy of the legend's classification rules.
//
// A node carries its membership status and its entry type; an edge carries its
// method, its strength tier within that method, and `nested` when it is one.
// Turning off a method therefore hides all of its tiers, since every one of its
// edges also carries the method key.

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

export const toggleKey = (
  disabled: Set<FilterKey>,
  key: FilterKey,
): Set<FilterKey> => {
  const next = new Set(disabled);
  if (!next.delete(key)) next.add(key);
  return next;
};
