import { cleanUpMultipleSlashes, getUrlForMeta, getUrlForApi } from '.';

const api = {
  protocol: 'https',
  hostname: 'www.example.com',
  port: '443',
  root: '/basename/',
};

describe('cleanUpMultipleSlashes', () => {
  test('clean up', () => {
    expect(cleanUpMultipleSlashes('http://www.example.com//api///1/2/')).toBe(
      'http://www.example.com/api/1/2/',
    );
    expect(cleanUpMultipleSlashes('//www.example.com//api///api/')).toBe(
      '//www.example.com/api/api/',
    );
  });
});

describe('getUrlForMeta', () => {
  const state = {
    settings: { api },
  };

  test('should return the root url', () => {
    expect(getUrlForMeta(state)).toBe('https://www.example.com:443/basename/');
  });
});

describe('getUrlForApi', () => {
  const settings = {
    api,
    navigation: { pageSize: 10 },
  };

  test('should return url for an Entry metadata', () => {
    const state = {
      settings,
      customLocation: {
        description: {
          main: { key: 'entry' },
          entry: { db: 'InterPro', accession: 'IPR000001' },
        },
        search: {},
      },
    };

    expect(getUrlForApi(state)).toBe(
      'https://www.example.com:443/basename/entry/InterPro/IPR000001/',
    );
  });

  test('should return url for a Structure metadata', () => {
    const state = {
      settings,
      customLocation: {
        description: {
          main: { key: 'structure' },
          structure: { db: 'PDB', accession: '101m' },
        },
        search: {},
      },
    };

    expect(getUrlForApi(state)).toBe(
      'https://www.example.com:443/basename/structure/PDB/101m/',
    );
  });

  test('should return url for an Entry metadata with extra info', () => {
    const state = {
      settings,
      customLocation: {
        description: {
          main: { key: 'entry' },
          entry: { db: 'InterPro', accession: 'IPR000001' },
          protein: { isFilter: true },
          structure: { isFilter: true },
        },
        search: {},
      },
    };

    expect(getUrlForApi(state)).toBe(
      'https://www.example.com:443/basename/entry/InterPro/IPR000001/protein/structure/',
    );
  });
});
