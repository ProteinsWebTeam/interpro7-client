// @flow
import * as types from 'actions/types';
import parseValueFromInput from './parse-value-from-input';

//:: import type { Description } from 'utils/processDescription/handlers';

//:: type Location = {pathname: string, search: Object, hash: string};
/*:: export type CustomLocation = {|
  description: Description,
  search?: {[key: string]: string},
  hash?: string,
|}; */

// Action creators
// custom location
export const goToCustomLocation = (
  customLocation /*: CustomLocation */,
  replace /*?: boolean */,
) => ({
  type: types.NEW_CUSTOM_LOCATION,
  customLocation,
  replace: !!replace,
});

export const customLocationChangeFromHistory = (
  customLocation /*: CustomLocation */,
) => ({
  type: types.NEW_PROCESSED_CUSTOM_LOCATION,
  customLocation,
});

// location
export const goToNewLocation = (
  location /*: string | Location */,
  replace /*: ?boolean */,
) => ({
  type: types.NEW_NEW_LOCATION,
  location,
  replace: !!replace,
});

export const newLocationChangeFromHistory = (newLocation /*: Object */) => ({
  type: types.NEW_PROCESSED_NEW_LOCATION,
  newLocation,
});

// UI
export const toggleEMBLMapNav = () => ({
  type: types.TOGGLE_EMBL_MAP_NAV,
});

export const openEMBLMapNav = () => ({
  type: types.TOGGLE_EMBL_MAP_NAV,
  status: 'open',
});

export const closeEMBLMapNav = () => ({
  type: types.TOGGLE_EMBL_MAP_NAV,
  status: 'close',
});

export const toggleSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
});

export const openSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
  status: 'open',
});

export const closeSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
  status: 'close',
});

export const closeEverything = () => ({
  type: types.CLOSE_EVERYTHING,
});

export const stick = () => ({
  type: types.STUCK,
});

export const unstick = () => ({
  type: types.UNSTUCK,
});

// settings
export const changePageSize = (pageSize /* :number */) => ({
  type: types.CHANGE_SETTINGS,
  category: 'pagination',
  key: 'pageSize',
  value: +pageSize,
});

export const changeSettings = (event /* :Event */) => {
  if (event.target instanceof HTMLInputElement) {
    return {
      type: types.CHANGE_SETTINGS,
      category: event.target.form && event.target.form.dataset.category,
      key: event.target.name,
      value: parseValueFromInput(event.target),
    };
  }
};

export const resetSettings = (value /*: ?Object */) => ({
  type: types.RESET_SETTINGS,
  value,
});

// data
export const loadingData = (key /*: string */) => ({
  type: types.LOADING_DATA,
  key,
});

export const loadedData = (key /*: string */, response /*: Object */) => ({
  type: types.LOADED_DATA,
  key,
  payload: response.payload,
  status: response.status,
  ok: response.ok,
});

export const progressData = (key /*: string */, progress /*: number */) => ({
  type: types.PROGRESS_DATA,
  key,
  progress,
});

export const unloadingData = (key /*: string */) => ({
  type: types.UNLOADING_DATA,
  key,
});

export const failedLoadingData = (key /*: string */, error /*: Error */) => ({
  type: types.FAILED_LOADING_DATA,
  key,
  error,
});

// toast messages
export const addToast = (toast /*: Object */, id /*: string */) => ({
  type: types.ADD_TOAST,
  id,
  toast,
});

export const removeToast = (id /*: string */) => ({
  type: types.REMOVE_TOAST,
  id,
});
