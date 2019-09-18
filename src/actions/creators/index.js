import * as types from 'actions/types';
import parseValueFromInput from './parse-value-from-input';

/*:: import type { Description } from 'utils/processDescription/handlers'; */

/*:: type Location = {pathname: string, search: Object, hash: string}; */
/*:: export type CustomLocation = {|
  description: Description,
  search?: {[key: string]: string},
  hash?: string,
|}; */

// Action creators
// custom location
export const goToCustomLocation = (
  customLocation /*: CustomLocation */,
  replace /*:: ?: boolean */,
  state /*:: ?: any */,
) => ({
  type: types.NEW_CUSTOM_LOCATION,
  customLocation,
  replace: !!replace,
  state,
});

export const customLocationChangeFromHistory = (
  customLocation /*: CustomLocation */,
  state /*:: ?: any */,
) => ({
  type: types.NEW_PROCESSED_CUSTOM_LOCATION,
  customLocation,
  state,
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

export const changeSettingsRaw = (category, key, value) => ({
  type: types.CHANGE_SETTINGS,
  category,
  key,
  value,
});

export const changeSettings = (event /* :Event */) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return changeSettingsRaw(
      event.target.form && event.target.form.dataset.category,
      event.target.name,
      parseValueFromInput(event.target),
    );
  }
};

export const resetSettings = (value /*: ?Object */) => ({
  type: types.RESET_SETTINGS,
  value,
});

// dataProgress
export const dataProgressInfo = (
  key /*: string */,
  progress /*: number */,
  weight /*: number */,
) => ({
  type: types.PROGRESS_DATA,
  key,
  progress,
  weight,
});

export const dataProgressUnload = (key /*: string */) => ({
  type: types.UNLOAD_DATA,
  key,
});

// jobs
export const createJob = (job /*: { metadata: Object, data: Object } */) => ({
  type: types.CREATE_JOB,
  job,
});

export const updateJob = (job /*: { metadata: Object, data: Object } */) => ({
  type: types.UPDATE_JOB,
  job,
});

export const deleteJob = (job /*: { metadata: Object, data: Object } */) => ({
  type: types.DELETE_JOB,
  job,
});

export const updateJobStatus = () => ({
  type: types.UPDATE_JOB_STATUS,
});

export const rehydrateJobs = (jobs /*: { [key: string]: Object } */) => ({
  type: types.REHYDRATE_JOBS,
  jobs,
});

export const loadDataJob = (job /*: { metadata: Object, data: Object } */) => ({
  type: types.LOAD_DATA_JOB,
  job,
});

export const unloadDataJob = (
  job /*: { metadata: Object, data: Object } */,
) => ({
  type: types.UNLOAD_DATA_JOB,
  job,
});

// download
export const downloadURL = (
  url /*: string */,
  fileType /*: 'accession' | 'fasta' | 'json' | 'ndjson' | 'tsv' | 'xml' */,
  subset /*: boolean */,
  endpoint /*: string */,
) => ({
  type: types.DOWNLOAD_URL,
  url,
  fileType,
  subset,
  endpoint,
});

export const downloadError = (
  url /*: string */,
  fileType /*: 'accession' | 'fasta' | 'json' | 'ndjson' | 'tsv' | 'xml' */,
  subset /*: boolean */,
  errorMessage /*: string */,
) => ({
  type: types.DOWNLOAD_ERROR,
  url,
  fileType,
  subset,
  errorMessage,
});

export const downloadSuccess = (
  url /*: string */,
  fileType /*: 'accession' | 'fasta' | 'json' | 'ndjson' | 'tsv' | 'xml' */,
  subset /*: boolean */,
  endpoint /*: string */,
  { blobURL, size } /*: { string, size } */,
) => ({
  type: types.DOWNLOAD_SUCCESS,
  url,
  fileType,
  subset,
  endpoint,
  blobURL,
  size,
});

export const downloadProgress = (
  url /*: string */,
  fileType /*: 'accession' | 'fasta' | 'json' | 'ndjson' | 'tsv' | 'xml' */,
  subset /*: boolean */,
  endpoint,
  progress /*: number */,
) => ({
  type: types.DOWNLOAD_PROGRESS,
  url,
  fileType,
  subset,
  endpoint,
  progress,
});

export const downloadDelete = (
  url /*: string */,
  fileType /*: 'accession' | 'fasta' | 'json' | 'ndjson' | 'tsv' | 'xml' */,
  subset /*: boolean */,
) => ({
  type: types.DOWNLOAD_DELETE,
  url,
  fileType,
  subset,
});

// status
export const serverStatus = (server /*: string */, status /*: boolean*/) => ({
  type: types.SERVER_STATUS,
  server,
  status,
});

export const browserStatus = (status /*: boolean*/) => ({
  type: types.BROWSER_STATUS,
  onLine: status,
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
