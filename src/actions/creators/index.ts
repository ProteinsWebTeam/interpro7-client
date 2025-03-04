import * as types from 'actions/types';
import parseValueFromInput from './parse-value-from-input';
import {
  DataProgressAction,
  DownloadAction,
  FavouritesAction,
  IPScanAction,
  IPScanMetadataAction,
  LocationAction,
  SettingsAction,
  StatusAction,
  ToastAction,
  UIAction,
} from 'actions/types';

// Action creators

// custom location
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
export const toggleEMBLMapNav = () =>
  ({
    type: types.TOGGLE_EMBL_MAP_NAV,
  }) as UIAction;

export const openEMBLMapNav = () =>
  ({
    type: types.TOGGLE_EMBL_MAP_NAV,
    status: 'open',
  }) as UIAction;

export const closeEMBLMapNav = () =>
  ({
    type: types.TOGGLE_EMBL_MAP_NAV,
    status: 'close',
  }) as UIAction;

export const toggleSideNav = () =>
  ({
    type: types.TOGGLE_SIDE_NAV,
  }) as UIAction;

export const openSideNav = () =>
  ({
    type: types.TOGGLE_SIDE_NAV,
    status: 'open',
  }) as UIAction;

export const closeSideNav = () =>
  ({
    type: types.TOGGLE_SIDE_NAV,
    status: 'close',
  }) as UIAction;

export const closeEverything = () =>
  ({
    type: types.CLOSE_EVERYTHING,
  }) as UIAction;

export const stick = () =>
  ({
    type: types.STUCK,
  }) as UIAction;

export const unstick = () =>
  ({
    type: types.UNSTUCK,
  }) as UIAction;

// settings
export const changePageSize = (pageSize: number) =>
  ({
    type: types.CHANGE_SETTINGS,
    category: 'pagination',
    key: 'pageSize',
    value: +pageSize,
  }) as SettingsAction;

export const changeSettingsRaw = (
  category: string,
  key: string,
  value: string | number | boolean | LabelUISettings | MatchTypeUISettings,
) => {
  return {
    type: types.CHANGE_SETTINGS,
    category,
    key,
    value,
  } as SettingsAction;
};

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

export const resetSettings = (value: unknown) =>
  ({
    type: types.RESET_SETTINGS,
    value,
  }) as SettingsAction;

// dataProgress
export const dataProgressInfo = (
  key: string,
  progress: number,
  weight: number,
) =>
  ({
    type: types.PROGRESS_DATA,
    key,
    progress,
    weight,
  }) as DataProgressAction;

export const dataProgressUnload = (key: string) =>
  ({
    type: types.UNLOAD_DATA,
    key,
  }) as DataProgressAction;

// jobs
export const createJob = (job: {
  metadata: MinimalJobMetadata;
  data: InitialJobData | IprscanDataIDB;
}) =>
  ({
    type: types.CREATE_JOB,
    job,
  }) as IPScanMetadataAction;

export const importJob = (job: {
  metadata: MinimalJobMetadata;
  data: InitialJobData;
}) =>
  ({
    type: types.IMPORT_JOB,
    job,
  }) as IPScanMetadataAction;
export const importJobFromData = (job: {
  metadata: MinimalJobMetadata;
  data: IprscanDataIDB;
}) =>
  ({
    type: types.IMPORT_JOB_FROM_DATA,
    job,
  }) as IPScanMetadataAction;
export const updateJob = (job: {
  metadata: MinimalJobMetadata;
  data?: IprscanDataIDB;
}) =>
  ({
    type: types.UPDATE_JOB,
    job,
  }) as IPScanMetadataAction;

export const deleteJob = (job: { metadata: unknown; data?: unknown }) =>
  ({
    type: types.DELETE_JOB,
    job,
  }) as IPScanAction;

export const updateJobStatus = () =>
  ({
    type: types.UPDATE_JOB_STATUS,
  }) as IPScanAction;

export const keepJobAsLocal = (localID: string) =>
  ({
    type: types.KEEP_JOB_AS_LOCAL,
    localID,
  }) as IPScanAction;

export const updateJobTitle = (jobID: string, value: string) =>
  ({
    type: types.UPDATE_JOB_TITLE,
    jobID,
    value,
  }) as IPScanAction;
export const updateSequenceJobTitle = (jobID: string, value: string) =>
  ({
    type: types.UPDATE_SEQUENCE_JOB_TITLE,
    jobID,
    value,
  }) as IPScanAction;

export const rehydrateJobs = (jobs: JobsState) =>
  ({
    type: types.REHYDRATE_JOBS,
    jobs,
  }) as IPScanAction;

// download
export const downloadURL = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  endpoint: string,
) =>
  ({
    type: types.DOWNLOAD_URL,
    url,
    fileType,
    subset,
    endpoint,
  }) as DownloadAction;

export const downloadError = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  errorMessage: string,
) =>
  ({
    type: types.DOWNLOAD_ERROR,
    url,
    fileType,
    subset,
    errorMessage,
  }) as DownloadAction;

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
  }: { blob: Blob; length: number; date: string; version: string },
) =>
  ({
    type: types.DOWNLOAD_SUCCESS,
    url,
    fileType,
    subset,
    endpoint,
    blob,
    length,
    date,
    version,
  }) as DownloadAction;

export const downloadProgress = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
  endpoint: string,
  progress: number,
) =>
  ({
    type: types.DOWNLOAD_PROGRESS,
    url,
    fileType,
    subset,
    endpoint,
    progress,
  }) as DownloadAction;

export const downloadDelete = (
  url: string,
  fileType: DownloadFileTypes,
  subset: boolean,
) =>
  ({
    type: types.DOWNLOAD_DELETE,
    url,
    fileType,
    subset,
  }) as DownloadAction;

// TODO: Update for correct types once the download-jobs middleware is migrated
export const setInitialDownloads = (downloads: Array<unknown>) => ({
  type: types.SET_INITIAL_DOWNLOADS,
  downloads,
});

// status
export const serverStatus = (server: string, status: boolean) =>
  ({
    type: types.SERVER_STATUS,
    server,
    status,
  }) as StatusAction;

export const browserStatus = (status: boolean) =>
  ({
    type: types.BROWSER_STATUS,
    onLine: status,
  }) as StatusAction;

// toast messages
export const addToast = (toast: ToastData, id: string) =>
  ({
    type: types.ADD_TOAST,
    id,
    toast,
  }) as ToastAction;

export const removeToast = (id: string) =>
  ({
    type: types.REMOVE_TOAST,
    id,
  }) as ToastAction;

// favourites
export const setInitialFavourites = (favourites: Array<string>) =>
  ({
    type: types.SET_INITIAL_FAVOURITES,
    favourites,
  }) as FavouritesAction;

export const markFavourite = (id: string, content: MetadataPayload<Metadata>) =>
  ({
    type: types.MARK_FAVOURITE,
    id,
    content,
  }) as FavouritesAction;

export const unmarkFavourite = (id: string) =>
  ({
    type: types.UNMARK_FAVOURITE,
    id,
  }) as FavouritesAction;
