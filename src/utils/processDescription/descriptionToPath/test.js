import descriptionToPath from '.';

describe('descriptionToPath()', () => {
  describe('basic', () => {
    test('home', () => {
      expect(descriptionToPath({})).toBe('/');
    });

    test('other', () => {
      expect(descriptionToPath({ other: ['download'] })).toBe('/download/');
      expect(descriptionToPath({ other: ['download', 'interproscan'] })).toBe(
        '/download/interproscan/',
      );
      expect(
        descriptionToPath({
          other: ['help', 'documentation', 'publication'],
        }),
      ).toBe('/help/documentation/publication/');
    });
  });

  describe('search', () => {
    const d = { main: { key: 'search' } };

    test('basic', () => {
      expect(descriptionToPath(d)).toBe('/search/');
    });

    test('with type', () => {
      for (const type of ['text', 'sequence']) {
        expect(descriptionToPath({ ...d, search: { type } })).toBe(
          `/search/${type}/`,
        );
      }
    });

    test('with value', () => {
      for (const type of ['text', 'sequence']) {
        for (const value of ['kinase', 'ATCTATHDJKLWKLKWLDKAEE', 'GO:12345']) {
          expect(descriptionToPath({ ...d, search: { type, value } })).toBe(
            `/search/${type}/${value}/`,
          );
        }
      }
    });
  });

  describe('data types', () => {
    const types = [
      'entry',
      'set',
      'structure',
      'protein',
      'taxonomy',
      'proteome',
    ];

    test('basic', () => {
      for (const key of types) {
        expect(descriptionToPath({ main: { key } })).toBe(`/${key}/`);
      }
    });

    test('basic combined', () => {
      for (const key of types) {
        const description = { main: { key } };
        const descriptionXFilters = { ...description };
        let i = 0;
        let accumulatedPath = `/${key}/`;
        for (const type of types) {
          if (key === type) continue;
          // Only one filter
          const descriptionOneFilter = { ...description };
          descriptionOneFilter[type] = { isFilter: true };
          const pathOneFilter = descriptionToPath(descriptionOneFilter);
          expect(pathOneFilter).toBe(`/${key}/${type}/`);
          // Multiple filters accumulated
          descriptionXFilters[type] = { isFilter: true, order: ++i };
          accumulatedPath += `${type}/`;
          const pathXFilters = descriptionToPath(descriptionXFilters);
          expect(pathXFilters).toEqual(
            expect.stringMatching(new RegExp(`^/${key}/(\\w+/){${i}}$`)),
          );
          expect(pathXFilters).toBe(accumulatedPath);
        }
      }
    });

    describe('single', () => {
      test('entry', () => {
        const description = {
          main: { key: 'entry' },
          entry: { db: 'InterPro' },
        };
        expect(descriptionToPath(description)).toBe('/entry/InterPro/');
        description.entry.accession = 'IPR000001';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/',
        );
        description.entry.memberDB = 'pfam';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/pfam/',
        );
        description.entry.memberDBAccession = 'PF00001';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/pfam/PF00001/',
        );
        description.entry.detail = 'domain_architecture';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/pfam/PF00001/domain_architecture/',
        );
        // reset entry object
        description.entry = { db: 'pfam' };
        expect(descriptionToPath(description)).toBe('/entry/pfam/');
        description.entry.accession = 'PF00001';
        expect(descriptionToPath(description)).toBe('/entry/pfam/PF00001/');
        description.entry.detail = 'domain_architecture';
        expect(descriptionToPath(description)).toBe(
          '/entry/pfam/PF00001/domain_architecture/',
        );
      });

      test('protein', () => {
        const description = {
          main: { key: 'protein' },
          protein: { db: 'UniProt' },
        };
        expect(descriptionToPath(description)).toBe('/protein/UniProt/');
        description.protein.accession = 'P99999';
        expect(descriptionToPath(description)).toBe('/protein/UniProt/P99999/');
        description.protein.detail = 'sequence';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/P99999/sequence/',
        );
      });

      test('structure', () => {
        const description = {
          main: { key: 'structure' },
          structure: { db: 'PDB' },
        };
        expect(descriptionToPath(description)).toBe('/structure/PDB/');
        description.structure.accession = '101m';
        expect(descriptionToPath(description)).toBe('/structure/PDB/101m/');
        description.structure.detail = 'whatever';
        expect(descriptionToPath(description)).toBe(
          '/structure/PDB/101m/whatever/',
        );
        description.structure.chain = 'A';
        expect(descriptionToPath(description)).toBe(
          '/structure/PDB/101m/A/whatever/',
        );
        description.structure.detail = null;
        expect(descriptionToPath(description)).toBe('/structure/PDB/101m/A/');
      });

      // TODO: test for taxonomy and proteomes
      // test('organism', () => {
      //   const description = {
      //     main: { key: 'organism' },
      //     organism: { db: 'taxonomy' },
      //   };
      //   expect(descriptionToPath(description)).toBe('/organism/taxonomy/');
      //   description.organism.accession = '1';
      //   expect(descriptionToPath(description)).toBe('/organism/taxonomy/1/');
      //   description.organism.detail = 'whatever';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/taxonomy/1/whatever/',
      //   );
      //   description.organism.detail = null;
      //   description.organism.proteomeDB = 'proteome';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/taxonomy/1/proteome/',
      //   );
      //   description.organism.proteomeAccession = 'UP000000278';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/taxonomy/1/proteome/UP000000278/',
      //   );
      //   description.organism.detail = 'whatever';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/taxonomy/1/proteome/UP000000278/whatever/',
      //   );
      //   // reset organism object
      //   description.organism = { proteomeDB: 'proteome' };
      //   expect(descriptionToPath(description)).toBe('/organism/proteome/');
      //   description.organism.proteomeAccession = 'UP000000278';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/proteome/UP000000278/',
      //   );
      //   description.organism.detail = 'whatever';
      //   expect(descriptionToPath(description)).toBe(
      //     '/organism/proteome/UP000000278/whatever/',
      //   );
      // });

      test('set', () => {
        const description = {
          main: { key: 'set' },
          set: { db: 'pfam' },
        };
        expect(descriptionToPath(description)).toBe('/set/pfam/');
        description.set.accession = 'cl0001';
        expect(descriptionToPath(description)).toBe('/set/pfam/cl0001/');
        description.set.detail = 'whatever';
        expect(descriptionToPath(description)).toBe(
          '/set/pfam/cl0001/whatever/',
        );
      });
    });

    describe('multiple', () => {
      test('entry … protein', () => {
        const description = {
          main: { key: 'entry' },
          protein: { isFilter: true, db: 'UniProt' },
        };
        expect(descriptionToPath(description)).toBe('/entry/protein/UniProt/');
        description.protein.accession = 'P99999';
        expect(descriptionToPath(description)).toBe(
          '/entry/protein/UniProt/P99999/',
        );
        // reset protein object
        description.protein = { isFilter: true };
        // add entry db
        description.entry = { db: 'InterPro' };
        expect(descriptionToPath(description)).toBe('/entry/InterPro/protein/');
        description.protein.db = 'UniProt';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/protein/UniProt/',
        );
        description.protein.accession = 'P99999';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/protein/UniProt/P99999/',
        );
        // reset protein object
        description.protein = { isFilter: true };
        // add entry accession
        description.entry.accession = 'IPR000001';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/protein/',
        );
        description.protein.db = 'UniProt';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/protein/UniProt/',
        );
        description.protein.accession = 'P99999';
        expect(descriptionToPath(description)).toBe(
          '/entry/InterPro/IPR000001/protein/UniProt/P99999/',
        );
      });

      test('protein … entry', () => {
        const description = {
          main: { key: 'protein' },
          entry: { isFilter: true, db: 'InterPro' },
        };
        expect(descriptionToPath(description)).toBe('/protein/entry/InterPro/');
        description.entry.accession = 'IPR000001';
        expect(descriptionToPath(description)).toBe(
          '/protein/entry/InterPro/IPR000001/',
        );
        // reset entry object
        description.entry = { isFilter: true };
        // add protein db
        description.protein = { db: 'UniProt' };
        expect(descriptionToPath(description)).toBe('/protein/UniProt/entry/');
        description.entry.db = 'InterPro';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/entry/InterPro/',
        );
        description.entry.accession = 'IPR000001';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/entry/InterPro/IPR000001/',
        );
        // reset entry object
        description.entry = { isFilter: true };
        // add protein accession
        description.protein.accession = 'P99999';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/P99999/entry/',
        );
        description.entry.db = 'InterPro';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/P99999/entry/InterPro/',
        );
        description.entry.accession = 'IPR000001';
        expect(descriptionToPath(description)).toBe(
          '/protein/UniProt/P99999/entry/InterPro/IPR000001/',
        );
      });
    });
  });
});
