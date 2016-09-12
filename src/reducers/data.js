import {LOADING_DATA, LOADED_DATA, FAILED_LOADING_DATA} from 'actions/types';

const DEFAULT_STATE = {urlKey: null, loading: false, data: null, error: null};

export default (
  state = DEFAULT_STATE,
  action
) => {
  switch (action.type) {
    // We will try to retrieve data
    case LOADING_DATA:
      // Set data for this key as loading
      return {...DEFAULT_STATE, urlKey: action.urlKey, loading: true};
    // We have successfully loaded data
    case LOADED_DATA:
      // This is not the fetch you are looking for, move along
      if (state.urlKey !== action.urlKey) return state;
      // Add the data to the redux state and remove loading flag
      return {...state, loading: false, data: action.data};
    // We failed to load data
    case FAILED_LOADING_DATA:
      // But, this is not the fetch you are looking for, move along
      if (state.urlKey !== action.urlKey) return state;
      // No data, but pass the error along to maybe display to the user
      return {...state, loading: false, error: action.error};
    default:
      return state;
  }
};
