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
  switch (target.type) {
    case 'range':
      return parseFloat(target.value);
    case 'checkbox':
      return target.checked;
    default:
      return target.value;
  }
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

export const loadingData = urlKey => ({
  type: types.LOADING_DATA,
  urlKey,
});

export const loadedData = (urlKey, data) => ({
  type: types.LOADED_DATA,
  urlKey,
  data,
});

export const failedLoadingData = (urlKey, error) => ({
  type: types.FAILED_LOADING_DATA,
  urlKey,
  error,
});
