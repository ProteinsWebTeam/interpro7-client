/* eslint-disable no-magic-numbers */
import reducer, { downloadSelector } from '.';
import { DOWNLOAD_URL } from 'actions/types';

describe('reducer for download handling in state', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  test('should handle DOWNLOAD_URL action', () => {
    expect(
      reducer(
        {},
        { type: DOWNLOAD_URL, url: 'www.example.com', fileType: 'FASTA' },
      ),
    ).toEqual({
      'www.example.com|FASTA': { progress: 0, successful: null, blobURL: null },
    });
  });
});

describe('selectors', () => {
  test('downloadSelector', () => {
    const state = { download: {} };
    expect(downloadSelector(state)).toBe(state.download);
  });
});
