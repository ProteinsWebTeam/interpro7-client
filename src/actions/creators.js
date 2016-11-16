import * as types from 'actions/types';

// Action creators
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

const parseValue = target => {
  switch (target.type) {
    case 'range':
      return parseFloat(target.value);
    case 'checkbox':
      return target.checked;
    default:
      return target.value;
  }
};

export const changePageSize = pageSize => ({
  type: types.CHANGE_SETTINGS,
  category: 'pagination',
  key: 'pageSize',
  value: +pageSize,
});
export const changeSettings = event => ({
  type: types.CHANGE_SETTINGS,
  category: event.target.form.dataset.category,
  key: event.target.name,
  value: parseValue(event.target),
});

export const resetSettings = (value = null) => ({
  type: types.RESET_SETTINGS,
  value,
});

export const loadingData = urlKey => ({
  type: types.LOADING_DATA,
  urlKey,
});

export const loadedData = (urlKey, dataUrl, data) => ({
  type: types.LOADED_DATA,
  urlKey,
  dataUrl,
  data,
});

export const unloadingData = () => ({
  type: types.UNLOADING_DATA,
});

export const failedLoadingData = (urlKey, error) => ({
  type: types.FAILED_LOADING_DATA,
  urlKey,
  error,
});
