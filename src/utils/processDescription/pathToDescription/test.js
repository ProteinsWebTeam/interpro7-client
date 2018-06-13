// @flow
import pathToDescription from '.';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

describe('pathToDescription()', () => {
  let d;

  beforeEach(() => {
    d = getEmptyDescription();
  });

  describe('basic pages', () => {
    test('home', () => {
      expect(pathToDescription('/')).toEqual(d);
    });

    describe('other', () => {
      test('release notes', () => {
        d.other[0] = 'release_notes';
        expect(pathToDescription('/release_notes/')).toEqual(d);
      });

      test('download', () => {
        d.other[0] = 'download';
        expect(pathToDescription('/download/')).toEqual(d);
      });

      test('whatever', () => {
        d.other[0] = 'whatever';
        expect(pathToDescription('/whatever/')).toEqual(d);
      });

      test('whatever 2 levels', () => {
        d.other[0] = 'whatever';
        d.other[1] = 'level_2';
        expect(pathToDescription('/whatever/level_2/')).toEqual(d);
      });

      test('whatever 3 levels', () => {
        d.other[0] = 'whatever';
        d.other[1] = 'level_2';
        d.other[2] = 'level_3';
        expect(pathToDescription('/whatever/level_2/level_3/')).toEqual(d);
      });

      test('whatever 4 levels, should throw', () => {
        expect(() =>
          pathToDescription('/whatever/level_2/level_3/level_4/'),
        ).toThrow('404');
      });
    });

    describe('search', () => {
      test('basic', () => {
        d.main.key = 'search';
        expect(pathToDescription('/search/')).toEqual(d);
      });

      test('text search', () => {
        d.main.key = 'search';
        d.search.type = 'text';
        expect(pathToDescription('/search/text/')).toEqual(d);
      });

      test('text search with value', () => {
        d.main.key = 'search';
        d.search.type = 'text';
        d.search.value = 'kinase';
        expect(pathToDescription('/search/text/kinase/')).toEqual(d);
      });
    });

    describe('main entry', () => {
      beforeEach(() => {
        d.main.key = 'entry';
      });

      test('basic', () => {
        expect(pathToDescription('/entry/')).toEqual(d);
        d.entry.db = 'InterPro';
        expect(pathToDescription('/entry/InterPro/')).toEqual(d);
        d.entry.accession = 'IPR000001';
        expect(pathToDescription('/entry/InterPro/IPR000001/')).toEqual(d);
        d.entry.detail = 'domain_architecture';
        expect(
          pathToDescription('/entry/InterPro/IPR000001/domain_architecture/'),
        ).toEqual(d);
        d.entry.detail = null;
        d.entry.memberDB = 'pfam';
        expect(pathToDescription('/entry/InterPro/IPR000001/pfam/')).toEqual(d);
        d.entry.memberDBAccession = 'PF00001';
        expect(
          pathToDescription('/entry/InterPro/IPR000001/pfam/PF00001/'),
        ).toEqual(d);
        d.entry.detail = 'domain_architecture';
        expect(
          pathToDescription(
            '/entry/InterPro/IPR000001/pfam/PF00001/domain_architecture/',
          ),
        ).toEqual(d);
      });

      test('entry integrated', () => {
        expect(pathToDescription('/entry/')).toEqual(d);
        d.entry.integration = 'integrated';
        expect(pathToDescription('/entry/integrated/')).toEqual(d);
        d.entry.db = 'cdd';
        expect(pathToDescription('/entry/integrated/cdd')).toEqual(d);
        d.entry.accession = 'CD00001';
        expect(pathToDescription('/entry/integrated/cdd/CD00001')).toEqual(d);
      });

      test('combined', () => {
        d.entry.db = 'InterPro';
        d.protein.isFilter = true;
        expect(pathToDescription('/entry/InterPro/protein/')).toEqual(d);
        // TODO: write more
      });
    });
  });
});
