const subscriptions = new Map();

export const subscribe = (key /*: string */, self /*: any */ /*: void */) => {
  const set = subscriptions.get(key) || new Set();
  set.add(self);
  subscriptions.set(key, set);
};

export const unsubscribe = (
  key /*: string */,
  self /*: any */ /*: boolean */,
) => {
  const set = subscriptions.get(key);
  set.delete(self);
  if (set.size) return false;
  subscriptions.delete(key);
  return true;
};
