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
        { type: DOWNLOAD_URL, url: 'www.example.com', fileType: 'fasta' },
      ),
    ).toEqual({
      'www.example.com|fasta': {
        progress: 0,
        successful: null,
        blobURL: null,
        size: null,
      },
    });
    expect(
      reducer(
        {},
        {
          type: DOWNLOAD_URL,
          url: 'www.example.com',
          fileType: 'fasta',
          subset: true,
        },
      ),
    ).toEqual({
      'www.example.com|fasta|subset': {
        progress: 0,
        successful: null,
        blobURL: null,
        size: null,
      },
    });
  });
});

describe('selectors', () => {
  test('downloadSelector', () => {
    const state = { download: {} };
    expect(downloadSelector(state)).toBe(state.download);
  });
});
