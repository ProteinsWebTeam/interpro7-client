import noop from 'lodash-es/noop';

import { getUrlForApi } from '../defaults';

import extractParams from '.';

const fakeGetUrl = () => {};

describe('extractParams', () => {
  test('default', () => {
    expect(extractParams()).toEqual({
      getUrl: getUrlForApi,
      fetchOptions: {},
      propNamespace: '',
      weight: 1,
      mapStateToProps: noop,
      mapDispatchToProps: {},
    });
  });

  test('basic', () => {
    expect(extractParams(fakeGetUrl)).toEqual({
      getUrl: fakeGetUrl,
      fetchOptions: {},
      propNamespace: '',
      weight: 1,
      mapStateToProps: noop,
      mapDispatchToProps: {},
    });
  });

  describe('advanced', () => {
    test('only getUrl', () => {
      expect(extractParams({ getUrl: fakeGetUrl })).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: {},
        propNamespace: '',
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('only fetchOptions', () => {
      expect(extractParams({ fetchOptions: { method: 'HEAD' } })).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: { method: 'HEAD' },
        propNamespace: '',
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('only propNamespace', () => {
      expect(extractParams({ propNamespace: 'Namespace' })).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: {},
        propNamespace: 'Namespace',
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('only weight', () => {
      expect(extractParams({ weight: 2 })).toEqual({
        getUrl: getUrlForApi,
        fetchOptions: {},
        propNamespace: '',
        weight: 2,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('getUrl and fetchOptions', () => {
      expect(
        extractParams({ getUrl: fakeGetUrl, fetchOptions: { method: 'HEAD' } }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: { method: 'HEAD' },
        propNamespace: '',
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('getUrl and propNamespace', () => {
      expect(
        extractParams({ getUrl: fakeGetUrl, propNamespace: 'Namespace' }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: {},
        propNamespace: 'Namespace',
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
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
        weight: 1,
        mapStateToProps: noop,
        mapDispatchToProps: {},
      });
    });

    test('all', () => {
      const mapStateToProps = () => {};
      const action = () => {};
      expect(
        extractParams({
          getUrl: fakeGetUrl,
          fetchOptions: { method: 'HEAD' },
          propNamespace: 'Namespace',
          weight: 2,
          mapStateToProps,
          mapDispatchToProps: { action },
        }),
      ).toEqual({
        getUrl: fakeGetUrl,
        fetchOptions: { method: 'HEAD' },
        propNamespace: 'Namespace',
        weight: 2,
        mapStateToProps,
        mapDispatchToProps: { action },
      });
    });
  });
});
