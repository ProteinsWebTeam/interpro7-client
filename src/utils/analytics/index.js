// @flow
import { schedule, sleep } from 'timing-functions/src';

import Storage from 'utils/storage';
import random from 'utils/random';

const THROTTLE_DELAY = 1e3;
const RANDOM_SPREAD = 6;

/*:: type AnalyticsType = 'navigation' | 'data' | 'error'; */
/*:: type UUID = string; */
/*:: type AnalyticsMessage = string | Object; */
/*:: type AnalyticsPayload = {|
  uuid: UUID,
  type: AnalyticsType,
  message: AnalyticsMessage,
  timestamp: number,
|}; */

class Analytics {
  /*:: _uuid: UUID; */
  /*:: _queue: Set<AnalyticsPayload>; */
  /*:: _processing: boolean; */
  constructor() {
    const storage = new Storage('user-id', 'local', THROTTLE_DELAY);
    let uuid = storage.getValue();
    if (!uuid) {
      uuid = `${Date.now()}-${`${random(
        0,
        10 ** RANDOM_SPREAD, // eslint-disable-line no-magic-numbers
        true,
      )}`.padStart(RANDOM_SPREAD, '0')}`;
      storage.setValue(uuid);
    }
    this._uuid = uuid;
    this._queue = new Set();
    this._processing = false;
  }

  // unqueue and process the list of messages, as many as possible in the
  // available time
  async _send() {
    if (this._processing) return;
    this._processing = true;
    for (const message of this._queue) {
      const deadline = await schedule();
      // TODO: remove this sleep (it's just to simulate the network delay)
      await sleep(100); // eslint-disable-line no-magic-numbers
      // TODO: do stuff here with the message (send to server, Google Analytics
      // TODO: or custom EBI server endpoint) instead of logging
      console.debug('analytics', message);
      this._queue.delete(message);
      // If there are still messages to send, but no time left
      if (this._queue.size && deadline.timeRemaining() > 0) {
        // reschedule and abort
        this._processing = false;
        this._send();
        return;
      }
      this._processing = false;
    }
  }

  // public, use to enqueue new messages to be eventually sent
  send(type /*: AnalyticsType */, message /*: AnalyticsMessage */) {
    const _message = { uuid: this._uuid, type, message, timestamp: Date.now() };
    this._queue.add(_message);
    this._send();
  }
}

export default new Analytics();
