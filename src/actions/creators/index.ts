// $FlowFixMe
import * as types from 'actions/types';
import parseValueFromInput from './parse-value-from-input';
import { PropsWithChildren } from 'react';
import { Action } from 'redux';

// Action creators
// custom location
export interface LocationAction extends Action {
  customLocation: InterProPartialLocation;
  replace?: boolean;
}

export const goToCustomLocation = (
  customLocation: InterProPartialLocation,
  replace?: boolean,
  state?: unknown,
) =>
  ({
    type: types.NEW_CUSTOM_LOCATION,
    customLocation,
    replace: !!replace,
    state,
  }) as LocationAction;

export const customLocationChangeFromHistory = (
  customLocation: InterProPartialLocation,
  state?: unknown,
) =>
  ({
    type: types.NEW_PROCESSED_CUSTOM_LOCATION,
    customLocation,
    state,
  }) as LocationAction;

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
export const changePageSize = (pageSize: number) => ({
  type: types.CHANGE_SETTINGS,
  category: 'pagination',
  key: 'pageSize',
  value: +pageSize,
});

export const changeSettingsRaw = (
  category: string,
  key: string,
  value: string | number | boolean | LabelUISettings,
) => ({
  type: types.CHANGE_SETTINGS,
  category,
  key,
  value,
});

export const changeSettings = (event: Event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return changeSettingsRaw(
      event.target.form?.dataset?.category || '',
      event.target.name,
      parseValueFromInput(event.target),
    );
  }
};

export const resetSettings = (value: unknown) => ({
  type: types.RESET_SETTINGS,
  value,
});

// dataProgress
export const dataProgressInfo = (
  key: string,
  progress: number,
  weight: number,
) => ({
  type: types.PROGRESS_DATA,
  key,
  progress,
  weight,
});

export const dataProgressUnload = (key: string) => ({
  type: types.UNLOAD_DATA,
  key,
});

// jobs
// TODO: Update for correct types once the ipscan-results branch gets merged
export const createJob = (job: { metadata: unknown; data: unknown }) => ({
  type: types.CREATE_JOB,
  job,
});

export const updateJob = (job: { metadata: unknown; data: unknown }) => ({
  type: types.UPDATE_JOB,
  job,
});

export const deleteJob = (job: { metadata: unknown; data?: unknown }) => ({
  type: types.DELETE_JOB,
  job,
});

export const updateJobStatus = () => ({
  type: types.UPDATE_JOB_STATUS,
});

export const keepJobAsLocal = (localID: string) => ({
  type: types.KEEP_JOB_AS_LOCAL,
  localID,
});

export const updateJobTitle = (
  job: { metadata: unknown; data: unknown },
  value: string,
) => ({
  type: types.UPDATE_JOB_TITLE,
  job,
  value,
});

// TODO: Update for correct types once the ipscan-results branch gets merged
export const rehydrateJobs = (jobs: Record<string, unknown>) => ({
  type: types.REHYDRATE_JOBS,
  jobs,
});

export const loadDataJob = (job: { metadata: unknown; data: unknown }) => ({
  type: types.LOAD_DATA_JOB,
  job,
});

export const importJob = (job: { metadata: unknown; data: unknown }) => ({
  type: types.IMPORT_JOB,
  job,
});
export const importJobFromData = (job: {
  metadata: unknown;
  data: unknown;
}) => ({
  type: types.IMPORT_JOB_FROM_DATA,
  job,
});

export const unloadDataJob = (job: { metadata: unknown; data: unknown }) => ({
  type: types.UNLOAD_DATA_JOB,
  job,
});

// download
export const downloadURL = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  endpoint: string,
) => ({
  type: types.DOWNLOAD_URL,
  url,
  fileType,
  subset,
  endpoint,
});

export const downloadError = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  errorMessage: string,
) => ({
  type: types.DOWNLOAD_ERROR,
  url,
  fileType,
  subset,
  errorMessage,
});

export const downloadSuccess = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  endpoint: string,
  {
    blob,
    length,
    date,
    version,
  }: { blob: unknown; length: number; date: string; version: string },
) => ({
  type: types.DOWNLOAD_SUCCESS,
  url,
  fileType,
  subset,
  endpoint,
  blob,
  length,
  date,
  version,
});

export const downloadProgress = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  endpoint: string,
  progress: number,
) => ({
  type: types.DOWNLOAD_PROGRESS,
  url,
  fileType,
  subset,
  endpoint,
  progress,
});

export const downloadDelete = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
) => ({
  type: types.DOWNLOAD_DELETE,
  url,
  fileType,
  subset,
});

// TODO: Update for correct types once the download-jobs middleware is migrated
export const setInitialDownloads = (downloads: Array<unknown>) => ({
  type: types.SET_INITIAL_DOWNLOADS,
  downloads,
});

// status
export const serverStatus = (server: string, status: boolean) => ({
  type: types.SERVER_STATUS,
  server,
  status,
});

export const browserStatus = (status: boolean) => ({
  type: types.BROWSER_STATUS,
  onLine: status,
});

// toast messages
// TODO: move this to the Toas component when it gets migrated
type ToastProps = {
  paused?: boolean;
  className?: string;
  title: string;
  body?: string;
  link?: PropsWithChildren<{ to: InterProPartialLocation }>;
  action?: {
    text: string;
    fn: () => void;
  };
  ttl?: number;
  checkBox?: {
    label: string;
    fn: () => void;
  };
  handleClose?: () => void;
};

export const addToast = (toast: ToastProps, id: string) => ({
  type: types.ADD_TOAST,
  id,
  toast,
});

export const removeToast = (id: string) => ({
  type: types.REMOVE_TOAST,
  id,
});

// favourites
export const setInitialFavourites = (favourites: Array<string>) => ({
  type: types.SET_INITIAL_FAVOURITES,
  favourites,
});

export const markFavourite = (
  id: string,
  content: MetadataPayload<Metadata>,
) => ({
  type: types.MARK_FAVOURITE,
  id,
  content,
});

export const unmarkFavourite = (id: string) => ({
  type: types.UNMARK_FAVOURITE,
  id,
});
