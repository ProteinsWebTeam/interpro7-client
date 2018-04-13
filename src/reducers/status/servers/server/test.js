// @flow
import getReducerFor from '.';
import { SERVER_STATUS, TEST } from 'actions/types';

const FAKE_DATE = 1234567890000;
const BEFORE_FAKE_DATE = FAKE_DATE - 1;

describe('reducer for settings', () => {
  let reducer;
  let dateNowSpy;

  beforeAll(() => {
    reducer = getReducerFor('api');
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => FAKE_DATE);
  });

  afterAll(() => {
    dateNowSpy.mockReset();
    dateNowSpy.mockRestore();
  });

  test('should return the initial state', () => {
    expect(reducer(undefined, { type: TEST })).toEqual({
      status: false,
      lastCheck: null,
    });
  });

  test('should handle CHANGE_SETTINGS action', () => {
    let state = reducer(
      { status: false, lastCheck: null },
      { type: SERVER_STATUS, server: 'api', status: true },
    );
    expect(state.status).toBe(true);
    expect(state.lastCheck).toBe(Date.now());
    state = reducer(
      { status: true, lastCheck: null },
      { type: SERVER_STATUS, server: 'api', status: true },
    );
    expect(state.status).toBe(true);
    expect(state.lastCheck).toBe(Date.now());
    state = reducer(
      { status: false, lastCheck: BEFORE_FAKE_DATE },
      { type: SERVER_STATUS, server: 'api', status: true },
    );
    expect(state.status).toBe(true);
    expect(state.lastCheck).toBe(Date.now());
    state = reducer(
      { status: true, lastCheck: BEFORE_FAKE_DATE },
      { type: SERVER_STATUS, server: 'api', status: true },
    );
    expect(state.status).toBe(true);
    expect(state.lastCheck).toBe(Date.now());
  });

  test('should ignore other server', () => {
    const untouched = { status: false, lastCheck: null };
    expect(reducer(untouched, { type: SERVER_STATUS, server: 'ebi' })).toBe(
      untouched,
    );
  });

  test('should ignore everything else', () => {
    const untouched = { status: false, lastCheck: null };
    expect(reducer(untouched, { type: TEST })).toBe(untouched);
  });
});
