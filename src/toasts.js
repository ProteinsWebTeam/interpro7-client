// @flow
import { addToast, removeToast } from 'actions/creators';
import { DEV } from 'config';
import id from 'utils/cheapUniqueId';

// import type {Store} from 'flow-typed/npm/redux';

let toastManager;

const ToastManager = class {
  /* ::
    _store: Store
  */
  constructor(store /*: Store */) {
    this._store = store;
  }

  add = (toast /*: Object */) => {
    const toastId = id();
    this._store.dispatch(addToast(toast, toastId));
    return toastId;
  };

  remove = (toastId /*: string */) =>
    this._store.dispatch(removeToast(toastId));
};

export const createToastManagerWithStore = (store /*: Store */) => {
  if (toastManager) {
    console.warn('Toast manager already instantiated', toastManager);
  } else {
    toastManager = new ToastManager(store);
    if (DEV) window.toastManager = toastManager;
  }
  return toastManager;
};

export const getToastManager = () => {
  if (toastManager) {
    return toastManager;
  }
  throw new Error("Toast manager doesn't exists (yet?)");
};
