import {addToast, removeToast} from 'actions/creators';
import {DEV} from 'config';

const DEFAULT_TIME_TO_LIVE_IN_MS = 3500;
let toastManager;

const ToastManager = class {
  constructor(store) {
    this._globalId = 0;
    this._store = store;
  }

  add = (toast, ttl = DEFAULT_TIME_TO_LIVE_IN_MS) => {
    const id = `${++this._globalId}`;
    this._store.dispatch(addToast(toast, id));
    setTimeout(() => this._store.dispatch(removeToast(id)), ttl);
    return id;
  };
};

export const createToastManagerWithStore = store => {
  if (toastManager) {
    console.warn('Toast manager already instantiated', toastManager);
  }
  toastManager = new ToastManager(store);
  if (DEV) window.toastManager = toastManager;
  return toastManager;
};

export const getToastManager = () => {
  if (toastManager) {
    return toastManager;
  }
  throw new Error('Toast manager doesn\'t exists (yet?)');
};
