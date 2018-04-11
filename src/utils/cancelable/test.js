// @flow
import cancelable from '.';

describe('cancelable', () => {
  describe('with promise', () => {
    test('to completion', async () => {
      const cancelablePromise = cancelable(Promise.resolve('output'));
      await expect(cancelablePromise.promise).resolves.toBe('output');
      expect(cancelablePromise.canceled).toBe(false);
    });

    test('cancel', async () => {
      const cancelablePromise = cancelable(Promise.resolve('output'));
      cancelablePromise.cancel();
      await expect(cancelablePromise.promise).rejects.toEqual({
        canceled: true,
      });
      expect(cancelablePromise.canceled).toBe(true);
    });
  });

  describe('with function', () => {
    test('to completion', async () => {
      const cancelablePromise = cancelable(() => Promise.resolve('output'));
      await expect(cancelablePromise.promise).resolves.toBe('output');
      expect(cancelablePromise.canceled).toBe(false);
    });

    test('cancel', async () => {
      const cancelablePromise = cancelable(() => Promise.resolve('output'));
      cancelablePromise.cancel();
      await expect(cancelablePromise.promise).rejects.toEqual({
        canceled: true,
      });
      expect(cancelablePromise.canceled).toBe(true);
    });
  });

  describe('without anything', () => {
    test('to completion', async () => {
      const cancelablePromise = cancelable();
      await expect(cancelablePromise.promise).resolves.toBeUndefined();
      expect(cancelablePromise.canceled).toBe(false);
    });

    test('cancel', async () => {
      const cancelablePromise = cancelable();
      cancelablePromise.cancel();
      await expect(cancelablePromise.promise).rejects.toEqual({
        canceled: true,
      });
      expect(cancelablePromise.canceled).toBe(true);
    });
  });
});
