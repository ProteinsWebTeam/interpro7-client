import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import server from './server';

export default combineReducers({
  api: server('api'),
  ebi: server('ebi'),
  ipScan: server('ipScan'),
  wikipedia: server('wikipedia'),
  alphafold: server('alphafold'),
  bfvd: server('bfvd'),
});

export const serverStatusesSelector = (state: GlobalState) =>
  state.status.servers;

const serverStatusSelectorFor = (server: Server) =>
  createSelector(serverStatusesSelector, (servers) => servers[server]);

export const apiServerStatus = serverStatusSelectorFor('api');
export const ebiServerStatus = serverStatusSelectorFor('ebi');
export const ipScanServerStatus = serverStatusSelectorFor('ipScan');
export const wikipediaServerStatus = serverStatusSelectorFor('wikipedia');
export const alphaFoldServerStatus = serverStatusSelectorFor('alphafold');
export const bfvdServerStatus = serverStatusSelectorFor('bfvd');
