// @flow
import GlobalMessage, { Subscription } from '.';

describe('GlobalMessage', () => {
  let subscription1;
  let subscription2;
  let subscription3;
  const callback1 = jest.fn();
  const callback2 = jest.fn();
  const callback3 = jest.fn();

  test('initialize subscriptions', () => {
    subscription1 = GlobalMessage.subscribe('message-1', callback1);
    subscription2 = GlobalMessage.subscribe('message-1', callback2);
    subscription3 = GlobalMessage.subscribe('message-2', callback3);
    expect(subscription1).toBeInstanceOf(Subscription);
    expect(subscription2).toBeInstanceOf(Subscription);
    expect(subscription3).toBeInstanceOf(Subscription);
  });

  test('dispatch messages', () => {
    subscription1.dispatch({ message: 'first message' });
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledWith({ message: 'first message' });
    expect(callback3).not.toHaveBeenCalled();

    GlobalMessage.dispatch('message-1', { message: 'second message' });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(2);
    expect(callback1).toHaveBeenCalledWith({ message: 'second message' });
    expect(callback2).toHaveBeenCalledWith({ message: 'second message' });
    expect(callback3).not.toHaveBeenCalled();

    GlobalMessage.dispatch('message-2', { message: 'third message' });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(2);
    expect(callback3).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledWith({ message: 'third message' });
  });

  test('cancel all subscriptions', () => {
    subscription1.unsubscribe();
    subscription2.unsubscribe();
    subscription3.unsubscribe();
    GlobalMessage.dispatch('message-1', {});
    expect(callback1).toHaveBeenCalledTimes(1);
  });
});
