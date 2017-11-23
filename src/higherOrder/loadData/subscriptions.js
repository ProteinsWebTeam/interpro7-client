// @flow
const subscriptions = new Map();

// prettier-ignore
export const subscribe = (
  key/*: ?string */,
  subscriptor/*: any */
)/*: void */ => {
  if (!key) return;
  const set = subscriptions.get(key) || new Set();
  set.add(subscriptor);
  subscriptions.set(key, set);
};

// prettier-ignore
export const unsubscribe = (
  key/*: ?string */,
  subscriptor/*: any */,
)/*: boolean */ => {
  if (!key) return false;
  const set = subscriptions.get(key) || new Set();
  if (set.has(subscriptor))
    set.delete(subscriptor);
  else {
    console.error(`Trying to delete an unexisting subscriptor for the URL ${key}`);
    return false;
  }
  if (set.size) return false;
  subscriptions.delete(key);
  return true;
};
