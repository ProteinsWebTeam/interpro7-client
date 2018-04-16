// @flow

/*:: type Callback = Object => any; */

const subscribersByType /*: Map<string, Set<Callback>>*/ = new Map();

export class Subscription {
  /*:: _type: string; */
  /*:: _callback: ?Callback ; */
  constructor(type /*: string */, callback /*: Callback */) {
    this._type = type;
    this._callback = callback;
  }

  dispatch(event /*: Object */, overrideType /*: ?string */) {
    if (!this._callback) return;
    // eslint-disable-next-line no-use-before-define
    GlobalMessage.dispatch(overrideType || this._type, event, this._callback);
  }

  unsubscribe() {
    if (!this._callback) return;
    const subscribersForType = subscribersByType.get(this._type);
    if (!subscribersForType) return;
    // Remove callback from set of listeners
    if (this._callback) subscribersForType.delete(this._callback);
    // If no more callback, remove corresponding Set from Map
    if (!subscribersForType.size) {
      subscribersByType.delete(this._type);
    }
    this._callback = null;
  }
}

class GlobalMessage {
  static subscribe(type /*: string */, callback /*: Callback */) {
    const subscribersForType = subscribersByType.get(type) || new Set();
    subscribersForType.add(callback);
    subscribersByType.set(type, subscribersForType);
    return new Subscription(type, callback);
  }

  static dispatch(
    type /*: string */,
    event /*: Object */,
    skipCallback /*:: ?: Callback */,
  ) {
    const subscribersForType = subscribersByType.get(type);
    if (!subscribersForType) return;
    const frozen = Object.freeze(event);
    for (const callback of subscribersForType) {
      if (skipCallback === callback) continue;
      callback(frozen);
    }
  }
}

export default GlobalMessage;
