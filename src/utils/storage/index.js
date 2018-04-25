// @flow
/*:: import type { Store } from 'redux'; */
import { DEV, pkg } from 'config';

import { debounceAndSchedule } from 'utils/timing';

class Memory {
  /*:: _memory: Map<string, any>; */
  constructor() {
    this._memory = new Map();
  }

  setItem(key, value) {
    this._memory.set(key, value);
  }

  getItem(key) {
    return this._memory.get(key);
  }
}

export default class Storage {
  /*::
    throttleDelay: number;
    _engine: any;
    _internalNamespace: string;
    _pendingValue: number;
    _linkedStore: Store<*, *>;
  */
  constructor(
    namespace /*: string */,
    type /*: string */ = '',
    throttleDelay /*: number */ = 0,
  ) {
    if (type.toLowerCase().includes('session')) {
      this._engine = self.sessionStorage;
    } else if (type.toLowerCase().includes('local')) {
      this._engine = self.localStorage;
    } else {
      this._engine = new Memory();
    }
    if (!this._engine) {
      this._engine = new Memory();
    }
    this.throttleDelay = throttleDelay;
    this._internalNamespace = `${pkg.name}-${namespace}`;
    this._saveSerializedValue = debounceAndSchedule(
      this._saveSerializedValue,
      this.throttleDelay,
    );
  }

  _saveSerializedValue = () => {
    this._engine.setItem(
      this._internalNamespace,
      JSON.stringify(this._pendingValue, null, DEV ? 2 : 0),
    );
  };

  getValue() {
    const serialized = this._engine.getItem(this._internalNamespace);
    if (!serialized) return null;
    return JSON.parse(serialized);
  }

  setValue(value /*: any */) {
    this._pendingValue = value;
    this._saveSerializedValue();
  }

  // get linkedStore() {
  //   return this._linkedStore;
  // }
  //
  // set linkedStore(store/*: Store<*, *> */) {
  //   this._linkedStore = store;
  // }
}
