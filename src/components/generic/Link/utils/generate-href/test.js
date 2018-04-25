// @flow
import generateHref from '.';

describe('generateHref', () => {
  test('href provided', () => {
    expect(generateHref({}, '/some/url/')).toBe('/some/url/');
  });

  test('with customLocation object', () => {
    expect(
      generateHref({
        description: {
          main: { key: 'entry' },
          entry: { db: 'InterPro', accession: 'IPR000001' },
        },
        search: {
          parameter: 'value',
        },
        hash: 'hash',
      }),
    ).toMatch(/\/entry\/InterPro\/IPR000001\/\?parameter=value#hash$/);
  });
});
