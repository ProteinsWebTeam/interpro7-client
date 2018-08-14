import { cleanUpMultipleSlashes, getUrlForMeta, getUrlForApi } from '.';

const api = {
  protocol: 'https',
  hostname: 'www.example.com',
  port: '443',
  root: '/basename/',
};

describe('cleanUpMultipleSlashes', () => {
  test('nothing passed', () => expect(cleanUpMultipleSlashes()).toBe(''));

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

  describe('should return url for an InterPro Entry list', () => {
    const description = {
      main: { key: 'entry' },
      entry: { db: 'InterPro' },
    };

    describe('page size from settings', () => {
      test('normal case', () => {
        const state = {
          settings,
          customLocation: {
            description,
            search: {},
          },
        };

        expect(getUrlForApi(state)).toBe(
          'https://www.example.com:443/basename/entry/InterPro/?page_size=10',
        );
      });

      test('should work even if `search` ends up empty or undefined', () => {
        const state = {
          settings,
          customLocation: { description },
        };

        expect(getUrlForApi(state)).toBe(
          'https://www.example.com:443/basename/entry/InterPro/?page_size=10',
        );

        state.customLocation.search = null;

        expect(getUrlForApi(state)).toBe(
          'https://www.example.com:443/basename/entry/InterPro/?page_size=10',
        );
      });
    });

    test('page size from URL', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: { page_size: 50 },
        },
      };

      expect(getUrlForApi(state)).toBe(
        'https://www.example.com:443/basename/entry/InterPro/?page_size=50',
      );
    });

    test('page size from settings, page 2', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: { page: 2 },
        },
      };

      const url = getUrlForApi(state);

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/entry\/InterPro\//,
        ),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page=2(&|$)/));
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });

    test('page size from URL, page 2', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: { page: 2, page_size: 50 },
        },
      };

      const url = getUrlForApi(state);

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/entry\/InterPro\//,
        ),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page=2(&|$)/));
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=50(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });

    test('specific case for table', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: { page_size: 50 },
          hash: 'table',
        },
      };

      expect(getUrlForApi(state)).toBe(
        'https://www.example.com:443/basename/entry/InterPro/?page_size=50',
      );
    });

    test('specific case for grid', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: {},
          hash: 'grid',
        },
      };

      const url = unescape(getUrlForApi(state));

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/entry\/InterPro\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(
          /[?&]extra_fields=description,literature,counters(&|$)/,
        ),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });

    test('specific case for grid, page 2', () => {
      const state = {
        settings,
        customLocation: {
          description,
          search: { page: 2, page_size: 50 },
          hash: 'grid',
        },
      };

      const url = unescape(getUrlForApi(state));

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/entry\/InterPro\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(
          /[?&]extra_fields=description,literature,counters(&|$)/,
        ),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page=2(&|$)/));
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=50(&|$)/));
      expect(url.match(/&/g).length).toBe(2);
    });
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

  describe('should return url for Taxonomy', () => {
    const description = {
      main: { key: 'taxonomy' },
      taxonomy: { db: 'uniprot' },
    };

    test('table', () => {
      const state = {
        settings,
        customLocation: { description, search: {}, hash: 'table' },
      };

      const url = getUrlForApi(state);

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/taxonomy\/uniprot\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(/[?&]extra_fields=counters(&|$)/),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });

    test('grid', () => {
      const state = {
        settings,
        customLocation: { description, search: {}, hash: 'grid' },
      };

      const url = unescape(getUrlForApi(state));

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/taxonomy\/uniprot\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(/[?&]extra_fields=lineage,counters(&|$)/),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });
  });

  describe('should return url for Proteome', () => {
    const description = {
      main: { key: 'proteome' },
      proteome: { db: 'uniprot' },
    };

    test('table', () => {
      const state = {
        settings,
        customLocation: { description, search: {}, hash: 'table' },
      };

      const url = getUrlForApi(state);

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/proteome\/uniprot\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(/[?&]extra_fields=counters(&|$)/),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });

    test('grid', () => {
      const state = {
        settings,
        customLocation: { description, search: {}, hash: 'grid' },
      };

      const url = getUrlForApi(state);

      expect(url).toEqual(
        expect.stringMatching(
          /^https:\/\/www\.example\.com:443\/basename\/proteome\/uniprot\//,
        ),
      );
      expect(url).toEqual(
        expect.stringMatching(/[?&]extra_fields=counters(&|$)/),
      );
      expect(url).toEqual(expect.stringMatching(/[?&]page_size=10(&|$)/));
      expect(url.match(/&/g).length).toBe(1);
    });
  });
});
