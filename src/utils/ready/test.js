// @flow
import ready from '.';

describe('ready helper function', () => {
  const readyPromise = ready();

  test('should eventually resolve', () => {
    expect(readyPromise).resolves.toBeUndefined();
  });

  test('should resolve when document is ready', async () => {
    await readyPromise;
    expect(typeof document.readyState).toBe('string');
    expect(document.readyState).not.toBe('loading');
  });
});
