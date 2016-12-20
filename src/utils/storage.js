// @flow
// import {throttleAndSchedule} from './timing';
import {DEV, pkg} from 'config';

import {debounceAndSchedule} from 'utils/timing';

export default class Storage {
  /* ::
    throttleDelay: number
    _engine: any
    _internalNamespace: string
    _pendingValue: number
  */
  constructor(
    namespace/*: string */,
    type/*: string */,
    throttleDelay/*: number */ = 0
  ) {
    if (!type) {
      throw new Error('No type specified, fallback to memory');
    }
    if (type.toLowerCase().includes('session')) {
      this._engine = self.sessionStorage;
    } else {
      this._engine = self.localStorage;
    }
    this.throttleDelay = throttleDelay;
    this._internalNamespace = `${pkg.name}-${namespace}`;
    this._saveSerializedValue = debounceAndSchedule(
      this._saveSerializedValue,
      this.throttleDelay
    );
  }

  _saveSerializedValue = () => {
    this._engine.setItem(
      this._internalNamespace,
      JSON.stringify(this._pendingValue, null, DEV ? 2 : 0)
    );
  };

  getValue() {
    const serialized = this._engine.getItem(this._internalNamespace);
    if (!serialized) return null;
    return JSON.parse(serialized);
  }

  setValue(value/*: any */) {
    this._pendingValue = value;
    this._saveSerializedValue();
  }

  // setLinkedStore(store) {
  //   this._linkedStore = store;
  // }
}
