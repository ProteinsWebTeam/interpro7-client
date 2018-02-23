const p = Symbol('private');

export default class Listener {
  constructor(type /*: string */, scopedWindow = window) {
    this[p] = {
      type,
      subscribedSet: new Set(),
      startListenerIfNeeded() {
        if (this.subscribedSet.size === 1) {
          scopedWindow.addEventListener(this.type, this.onEvent.bind(this));
        }
      },
      stopListenerIfNeeded() {
        if (!this.subscribedSet.size) {
          scopedWindow.removeEventListener(this.type, this.onEvent.bind(this));
        }
      },
      onEvent(e) {
        // throttle?
        this.subscribedSet.forEach(fn => fn(e));
      },
    };
  }

  subscribe(fn /*: function */) {
    this[p].subscribedSet.add(fn);
    this[p].startListenerIfNeeded();
    return () => {
      this[p].subscribedSet.delete(fn);
      this[p].stopListenerIfNeeded();
    };
  }
}
