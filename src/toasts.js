import {addToast, removeToast} from 'actions/creators';
import {DEV} from 'config';
import id from 'utils/cheapUniqueId';

let toastManager;

const ToastManager = class {
  constructor(store) {
    this._store = store;
  }

  add = toast => {
    const toastId = `${id()}`;
    this._store.dispatch(addToast(toast, toastId));
    return toastId;
  };

  remove = toastId => this._store.dispatch(removeToast(toastId));
};

export const createToastManagerWithStore = store => {
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
  throw new Error('Toast manager doesn\'t exists (yet?)');
};
