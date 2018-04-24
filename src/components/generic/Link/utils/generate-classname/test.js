// @flow
import generateClassname, { getHashPartWithoutHashSign } from '.';

describe('getHashPartWithoutHashSign', () => {
  test('undefined', () => {
    expect(getHashPartWithoutHashSign()).toBe('');
  });

  test('null', () => {
    expect(getHashPartWithoutHashSign(null)).toBe('');
  });

  test('empty string', () => {
    expect(getHashPartWithoutHashSign('')).toBe('');
  });

  test('correct hash string', () => {
    expect(getHashPartWithoutHashSign('#hash')).toBe('hash');
  });

  test('already clean hash string', () => {
    expect(getHashPartWithoutHashSign('hash')).toBe('hash');
  });
});

describe('generateClassname', () => {
  test('href provided to component', () => {
    expect(
      generateClassname(
        'active',
        {},
        '//www.example.com/',
        '//www.example.com/',
      ),
    ).toBeUndefined();
  });

  test('activeClass is a function', () => {
    expect(generateClassname(() => 'active', {}, undefined, '/url/')).toBe(
      'active',
    );
    const testFn = jest.fn();
    const fakeCustomLocation = {};
    generateClassname(testFn, fakeCustomLocation, undefined, '/url/');
    expect(testFn).toHaveBeenCalledWith(fakeCustomLocation);
  });

  describe('checking browser location', () => {
    let originalHref;
    let home;
    beforeAll(() => {
      originalHref = window.location.href;
      home = window.location.pathname;
    });

    beforeEach(() => {
      window.history.replaceState(null, null, originalHref);
    });

    test('from home', () => {
      expect(generateClassname('active', {}, undefined, home)).toBe('active');
      expect(generateClassname('active', {}, undefined, home, true)).toBe(
        'active',
      );
      expect(
        generateClassname('active', {}, undefined, `${home}about/`),
      ).toBeUndefined();
      expect(
        generateClassname('active', {}, undefined, `${home}about/`, true),
      ).toBeUndefined();
      expect(
        generateClassname('active', {}, undefined, `${home}entry/InterPro/`),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/`,
          true,
        ),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
        ),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
          true,
        ),
      ).toBeUndefined();
    });

    test('from about', () => {
      window.history.replaceState(null, null, 'about/');
      expect(generateClassname('active', {}, undefined, home)).toBe('active');
      expect(
        generateClassname('active', {}, undefined, home, true),
      ).toBeUndefined();
      expect(generateClassname('active', {}, undefined, `${home}about/`)).toBe(
        'active',
      );
      expect(
        generateClassname('active', {}, undefined, `${home}about/`, true),
      ).toBe('active');
      expect(
        generateClassname('active', {}, undefined, `${home}entry/InterPro/`),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/`,
          true,
        ),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
        ),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
          true,
        ),
      ).toBeUndefined();
    });

    test('from one entry page', () => {
      window.history.replaceState(null, null, 'entry/InterPro/IPR000001/');
      expect(generateClassname('active', {}, undefined, home)).toBe('active');
      expect(
        generateClassname('active', {}, undefined, home, true),
      ).toBeUndefined();
      expect(
        generateClassname('active', {}, undefined, `${home}about/`),
      ).toBeUndefined();
      expect(
        generateClassname('active', {}, undefined, `${home}about/`, true),
      ).toBeUndefined();
      expect(
        generateClassname('active', {}, undefined, `${home}entry/InterPro/`),
      ).toBe('active');
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/`,
          true,
        ),
      ).toBeUndefined();
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
        ),
      ).toBe('active');
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/IPR000001/`,
          true,
        ),
      ).toBe('active');
    });

    test('from entry browse, with hashes', () => {
      window.history.replaceState(null, null, 'entry/InterPro/#grid');
      expect(
        generateClassname('active', {}, undefined, `${home}entry/InterPro/`),
      ).toBe('active');
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/#grid`,
        ),
      ).toBe('active');
      expect(
        generateClassname(
          'active',
          {},
          undefined,
          `${home}entry/InterPro/#table`,
        ),
      ).toBeUndefined();
    });
  });
});
