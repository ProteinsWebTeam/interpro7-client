// @flow
import Listener from '.';

describe('custom event listener', () => {
  test('should subscribe to window', () => {
    const window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const listener = new Listener('test', window);
    expect(window.addEventListener.mock.calls.length).toBe(0);
    expect(window.removeEventListener.mock.calls.length).toBe(0);
    const [cb1, cb2] = [jest.fn(), jest.fn()];
    const unsubscribes = [cb1, cb2].map(cb => listener.subscribe(cb));
    expect(window.addEventListener.mock.calls[0][0]).toBe('test');
    expect(window.removeEventListener.mock.calls.length).toBe(0);
    unsubscribes[1]();
    expect(window.addEventListener.mock.calls.length).toBe(1);
    expect(window.removeEventListener.mock.calls.length).toBe(0);
    unsubscribes[0]();
    expect(window.addEventListener.mock.calls.length).toBe(1);
    expect(window.removeEventListener.mock.calls.length).toBe(1);
    expect(cb1.mock.calls.length).toBe(0);
    expect(cb2.mock.calls.length).toBe(0);
  });

  test('should call function callbacks', () => {
    const listener = new Listener('change', window.document.body);
    const fn = jest.fn();
    listener.subscribe(fn);
    const event = document.createEvent('Event');
    event.initEvent('change', true, true);
    window.document.body.dispatchEvent(event);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
