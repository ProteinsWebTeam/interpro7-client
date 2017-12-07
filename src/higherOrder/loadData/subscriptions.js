// @flow
const subscriptions = new Map();

// prettier-ignore
export const subscribe = (
  key/*: ?string */,
  subscriber/*: any */
)/*: void */ => {
  if (!key) return;
  const set = subscriptions.get(key) || new Set();
  set.add(subscriber);
  subscriptions.set(key, set);
};

// prettier-ignore
export const unsubscribe = (
  key/*: ?string */,
  subscriber/*: any */,
)/*: boolean */ => {
  if (!key) return false;
  const set = subscriptions.get(key) || new Set();
  if (set.has(subscriber))
    set.delete(subscriber);
  else {
    console.error(`Trying to delete an unexisting subscriber for the URL ${key}`);
    return false;
  }
  if (set.size) return false;
  subscriptions.delete(key);
  return true;
};
