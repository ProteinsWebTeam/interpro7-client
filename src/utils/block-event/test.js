// @flow
import blockEvent from '.';

describe('blockEvent', () => {
  test('should block an event to do its default behaviour', () => {
    const event = document.createEvent('Event');
    event.initEvent('change', true, true);
    const listener = jest.fn();
    const target = document.createElement('input');
    target.addEventListener('change', blockEvent(listener));
    target.dispatchEvent(event);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
