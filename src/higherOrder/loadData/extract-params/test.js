import { getUrlForApi } from '../defaults';

import extractParams from '.';

const fakeGetUrl = () => {};

describe('extractParams', () => {
  test('default', () => {
    expect(extractParams()).toEqual({
      getUrl: getUrlForApi,
      fetchOptions: {},
      propNamespace: '',
    });
  });

  test('basic', () => {
    expect(extractParams(fakeGetUrl)).toEqual({
      getUrl: fakeGetUrl,
      fetchOptions: {},
      propNamespace: '',
    });
  });

  describe('advanced', () => {
    test('only getUrl', () => {
      expect(extractParams({ getUrl: fakeGetUrl })).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: {},
        propNamespace: '',
      });
    });

    test('only fetchOptions', () => {
      expect(extractParams({ fetchOptions: { method: 'HEAD' } })).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: { method: 'HEAD' },
        propNamespace: '',
      });
    });

    test('only propNamespace', () => {
      expect(extractParams({ propNamespace: 'Namespace' })).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: {},
        propNamespace: 'Namespace',
      });
    });

    test('getUrl and fetchOptions', () => {
      expect(
        extractParams({ getUrl: fakeGetUrl, fetchOptions: { method: 'HEAD' } }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: { method: 'HEAD' },
        propNamespace: '',
      });
    });

    test('getUrl and propNamespace', () => {
      expect(
        extractParams({ getUrl: fakeGetUrl, propNamespace: 'Namespace' }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: {},
        propNamespace: 'Namespace',
      });
    });

    test('fetchOptions and propNamespace', () => {
      expect(
        extractParams({
          fetchOptions: { method: 'HEAD' },
          propNamespace: 'Namespace',
        }),
      ).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: { method: 'HEAD' },
        propNamespace: 'Namespace',
      });
    });

    test('all', () => {
      expect(
        extractParams({
          getUrl: fakeGetUrl,
          fetchOptions: { method: 'HEAD' },
          propNamespace: 'Namespace',
        }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: { method: 'HEAD' },
        propNamespace: 'Namespace',
      });
    });
  });
});
