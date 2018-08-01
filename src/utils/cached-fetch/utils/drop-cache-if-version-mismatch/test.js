import dropCacheIfVersionMismatch, { VersionHeader } from '.';

describe.skip('dropCacheIfVersionMismatch', () => {
  beforeAll(() => {
    // Mock sessionStorage
    window.sessionStorage = new Map();
    Object.defineProperty(window.sessionStorage, 'length', {
      get: () => window.sessionStorage.size,
    });

    window.sessionStorage.set('key', 'value');
  });

  test('first runs, no version', () => {
    expect(dropCacheIfVersionMismatch(new Map())).toBeFalsy();
    expect(
      dropCacheIfVersionMismatch(new Map([[VersionHeader, '10']])),
    ).toBeFalsy();
    expect(sessionStorage.length).toBe(1);
  });

  test('follow-up run, same version', () => {
    expect(
      dropCacheIfVersionMismatch(new Map([[VersionHeader, '10']])),
    ).toBeFalsy();
    expect(sessionStorage.length).toBe(1);
  });

  test('follow-up run, new version', () => {
    expect(dropCacheIfVersionMismatch(new Map([[VersionHeader, '11']]))).toBe(
      true,
    );
    expect(sessionStorage.length).toBe(0);
  });
});
