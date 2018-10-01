// @flow
import { debounce } from 'lodash-es';

// Default delay if none is provided to the function
const DEFAULT_DELAY = 1000; // 1s 🕑
// Basic debouncer
const nonScheduled = (
  cb /*: function */,
  minDelay /*: number */ = DEFAULT_DELAY,
) => debounce(cb, minDelay);

// Try to find the ideal way to schedule the function to avoid jank
let scheduler;
// Best one 👍: requestIdleCallback
if (self.requestIdleCallback) {
  scheduler = 'requestIdleCallback';
}
// Kinda OK: requestAnimationFrame
if (!scheduler && self.requestAnimationFrame) {
  scheduler = 'requestAnimationFrame';
}

export const debounceAndSchedule = (() => {
  // If we have one of the 2 acceptable schedulers, use it
  if (scheduler) {
    // Advanced debouncer: debounce, then schedule for best execution time
    return (cb /*: function */, minDelay /*: number */) =>
      nonScheduled(() => self[scheduler](() => cb()), minDelay);
  }
  // 😞, just return the standard debounced function
  return nonScheduled;
})();
