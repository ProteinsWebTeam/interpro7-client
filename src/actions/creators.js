import * as types from 'actions/types';

// Action creators
export const toggleSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
});

export const openSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
  status: 'open',
});

export const closeSideNav = () => ({
  type: types.TOGGLE_SIDE_NAV,
  status: 'closed',
});

const parseValue = target => {
  if (target.type === 'range') return parseFloat(target.value);
  return target.value;
};

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

export const loadingData = key => ({
  type: types.LOADING_DATA,
  key,
});

export const loadedData = (key, data) => ({
  type: types.LOADED_DATA,
  key,
  data,
});

export const failedLoadingData = (key, error) => ({
  type: types.FAILED_LOADING_DATA,
  key,
  error,
});
