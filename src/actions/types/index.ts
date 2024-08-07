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
export const UPDATE_SEQUENCE_JOB_TITLE = 'UPDATE_SEQUENCE_JOB_TITLE';
export const KEEP_JOB_AS_LOCAL = 'KEEP_JOB_AS_LOCAL';
export const REHYDRATE_JOBS = 'REHYDRATE_JOBS';
export const IMPORT_JOB = 'IMPORT_JOB';
export const IMPORT_JOB_FROM_DATA = 'IMPORT_JOB_FROM_DATA';
export interface IPScanAction
  extends Action<
    | typeof CREATE_JOB
    | typeof UPDATE_JOB
    | typeof DELETE_JOB
    | typeof UPDATE_JOB_STATUS
    | typeof UPDATE_JOB_TITLE
    | typeof UPDATE_SEQUENCE_JOB_TITLE
    | typeof KEEP_JOB_AS_LOCAL
    | typeof REHYDRATE_JOBS
    | typeof IMPORT_JOB
    | typeof IMPORT_JOB_FROM_DATA
  > {
  url: string;
}

// download
export const DOWNLOAD_URL = 'DOWNLOAD_URL';
export const DOWNLOAD_PROGRESS = 'DOWNLOAD_PROGRESS';
export const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR';
export const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS';
export const DOWNLOAD_DELETE = 'DOWNLOAD_DELETE';
export const SET_INITIAL_DOWNLOADS = 'SET_INITIAL_DOWNLOADS';

export interface DownloadAction
  extends Action<
    | typeof DOWNLOAD_URL
    | typeof DOWNLOAD_PROGRESS
    | typeof DOWNLOAD_ERROR
    | typeof DOWNLOAD_SUCCESS
    | typeof DOWNLOAD_DELETE
  > {
  url: string;
  key?: string;
  fileType: DownloadFileTypes;
  subset: boolean;
  endpoint?: Endpoint;
  errorMessage?: string;
  progress?: number;
  blob?: Blob;
  length?: number;
  date?: string;
  version?: string;
}

export interface InitialDownloadsAction
  extends Action<typeof SET_INITIAL_DOWNLOADS> {
  downloads: Array<CompletedDownload>;
}

// settings
export const CHANGE_SETTINGS = 'CHANGE_SETTINGS';
export const RESET_SETTINGS = 'RESET_SETTINGS';
export interface SettingsAction
  extends Action<typeof CHANGE_SETTINGS | typeof RESET_SETTINGS> {
  category?: string;
  key?: string;
  value?: string | number | boolean | LabelUISettings;
}

// status
export const BROWSER_STATUS = 'BROWSER_STATUS';
export const SERVER_STATUS = 'SERVER_STATUS';
export interface StatusAction
  extends Action<typeof BROWSER_STATUS | typeof SERVER_STATUS> {
  server?: string;
  status?: boolean;
  onLine?: boolean;
}
// UI
export const TOGGLE_SIDE_NAV = 'TOGGLE_SIDE_NAV';
export const TOGGLE_EMBL_MAP_NAV = 'TOGGLE_EMBL_MAP_NAV';
export const CLOSE_EVERYTHING = 'CLOSE_EVERYTHING';
export const STUCK = 'STUCK';
export const UNSTUCK = 'UNSTUCK';
export interface UIAction
  extends Action<
    | typeof TOGGLE_SIDE_NAV
    | typeof TOGGLE_EMBL_MAP_NAV
    | typeof CLOSE_EVERYTHING
    | typeof STUCK
    | typeof UNSTUCK
  > {
  status?: 'open' | 'close';
}

// toast messages
export const ADD_TOAST = 'ADD_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';
export interface ToastAction
  extends Action<typeof ADD_TOAST | typeof REMOVE_TOAST> {
  id: string;
  toast?: ToastData;
}
// favourites
export const SET_INITIAL_FAVOURITES = 'SET_INITIAL_FAVOURITES';
export const MARK_FAVOURITE = 'MARK_FAVOURITE';
export const UNMARK_FAVOURITE = 'UNMARK_FAVOURITE';
export interface FavouritesAction
  extends Action<
    | typeof SET_INITIAL_FAVOURITES
    | typeof MARK_FAVOURITE
    | typeof UNMARK_FAVOURITE
  > {
  favourites?: Array<string>;
  id?: string;
  content?: MetadataPayload<Metadata>;
}

// For use in tests
export const TEST = '@TEST';
