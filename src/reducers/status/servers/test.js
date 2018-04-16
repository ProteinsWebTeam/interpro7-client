import {
  serverStatusesSelector,
  apiServerStatus,
  ebiServerStatus,
  ipScanServerStatus,
} from '.';

describe('selectors', () => {
  const state = { status: { servers: { api: {}, ebi: {}, ipScan: {} } } };

  test('serverStatusesSelector', () => {
    expect(serverStatusesSelector(state)).toBe(state.status.servers);
  });

  test('apiServerStatus', () => {
    expect(apiServerStatus(state)).toBe(state.status.servers.api);
  });

  test('ebiServerStatus', () => {
    expect(ebiServerStatus(state)).toBe(state.status.servers.ebi);
  });

  test('ipScanServerStatus', () => {
    expect(ipScanServerStatus(state)).toBe(state.status.servers.ipScan);
  });
});
