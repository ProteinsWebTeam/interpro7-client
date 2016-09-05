// import {throttleAndSchedule} from './timing';
import required from './required';
import {DEV, pkg} from 'config';

import {debounceAndSchedule} from 'utils/timing';

export default class Storage {
  constructor(namespace = required('namespace'), type, throttleDelay = 0) {
    if (!type) {
      throw new Error('No type specified, fallback to memory');
    }
    if (type.toLowerCase().includes('session')) {
      this._engine = self.sessionStorage;
    } else {
      this._engine = self.localStorage;
    }
    this.throttleDelay = throttleDelay;
    this.namespace = namespace;
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
  }

  getValue() {
    return JSON.parse(this._engine.getItem(this._internalNamespace) || null);
  }

  setValue(value) {
    this._pendingValue = value;
    this._saveSerializedValue();
  }

  setLinkedStore(store) {
    this._linkedStore = store;
  }
}
