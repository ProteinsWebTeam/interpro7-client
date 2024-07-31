import { Action } from 'redux';

// custom location
export const NEW_CUSTOM_LOCATION = 'NEW_CUSTOM_LOCATION';
export const NEW_PROCESSED_CUSTOM_LOCATION = 'NEW_PROCESSED_CUSTOM_LOCATION';

export interface LocationAction
  extends Action<
    typeof NEW_CUSTOM_LOCATION | typeof NEW_PROCESSED_CUSTOM_LOCATION
  > {
  customLocation: InterProPartialLocation;
  replace?: boolean;
  state?: unknown;
}

// data
export const PROGRESS_DATA = 'PROGRESS_DATA';
export const UNLOAD_DATA = 'UNLOAD_DATA';

export interface DataProgressAction
  extends Action<typeof PROGRESS_DATA | typeof UNLOAD_DATA> {
  key: string;
  progress?: number;
  weight?: number;
}

// jobs
export const CREATE_JOB = 'CREATE_JOB';
export const UPDATE_JOB = 'UPDATE_JOB';
export const DELETE_JOB = 'DELETE_JOB';
export const UPDATE_JOB_STATUS = 'UPDATE_JOB_STATUS';
export const UPDATE_JOB_TITLE = 'UPDATE_JOB_TITLE';
export const KEEP_JOB_AS_LOCAL = 'KEEP_JOB_AS_LOCAL';
export const REHYDRATE_JOBS = 'REHYDRATE_JOBS';
export const LOAD_DATA_JOB = 'LOAD_DATA_JOB';
export const UNLOAD_DATA_JOB = 'UNLOAD_DATA_JOB';
export const IMPORT_JOB = 'IMPORT_JOB';
export const IMPORT_JOB_FROM_DATA = 'IMPORT_JOB_FROM_DATA';

// download
export const DOWNLOAD_URL = 'DOWNLOAD_URL';
export const DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS';
export const DOWNLOAD_DELETE = 'DOWNLOAD_DELETE';
export const SET_INITIAL_DOWNLOADS = 'SET_INITIAL_DOWNLOADS';

// settings
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const RESET_SETTINGS = 'RESET_SETTINGS';

// status
export const BROWSER_STATUS = 'BROWSER_STATUS';
export const SERVER_STATUS = 'SERVER_STATUS';

// UI
export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';
export const TOGGLE_EMBL_MAP_NAV = 'TOGGLE_EMBL_MAP_NAV';
export const CLOSE_EVERYTHING = 'CLOSE_EVERYTHING';
export const STUCK = 'STUCK';
export const UNSTUCK = 'UNSTUCK';

// toast messages
export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';

// favourites
export const SET_INITIAL_FAVOURITES = 'SET_INITIAL_FAVOURITES';
export const MARK_FAVOURITE = 'MARK_FAVOURITE';
export const UNMARK_FAVOURITE = 'UNMARK_FAVOURITE';

// For use in tests
export const TEST = '@TEST';
