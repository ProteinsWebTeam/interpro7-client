// @flow
import { schedule, sleep } from 'timing-functions/src';

/*:: type ResizeObserverEntry = {
  target: HTMLElement,
  contentRect: {[key: string]: number},
}; */

export default (() => {
  // Use native if possible
  if ('ResizeObserver' in window) return window.ResizeObserver;
  // or fallback, with incomplete polyfill, that should be enough for what we do
  return class ResizeObserver {
    /*:: _node: ?HTMLElement; */
    /*:: _onResizeEvent: Array<ResizeObserverEntry> => any; */
    /*:: _handleResize: Promise<void>; */
    constructor(onResizeEvent /*: Array<ResizeObserverEntry> => any */) {
      if (typeof onResizeEvent !== 'function') {
        throw new Error('missing resize handler');
      }
      this._onResizeEvent = onResizeEvent;
    }

    _handleResize = async () => {
      await schedule();
      if (!this._node) return;
      this._onResizeEvent([
        {
          target: this._node,
          contentRect: this._node.getBoundingClientRect(),
        },
      ]);
    };

    observe(node /*: HTMLElement */) {
      if (!node instanceof HTMLElement) {
        throw new Error('ResizeObserver only works on HTML elements');
      }
      if (this._node) {
        throw new Error('ResizeObserver fallback only supports one node');
      }
      this._node = node;
      window.addEventListener('resize', this._handleResize);
      this._handleResize();
      // just in case it happened too soon, just redo it after a bit
      // eslint-disable-next-line no-magic-numbers
      sleep(1000).then(this._handleResize);
    }

    unobserve(node /*: HTMLElement */) {
      if (this._node && this._node !== node) {
        throw new Error('Trying to unobserve the wrong node');
      }
      this._node = null;
      window.removeEventListener('resize', this._handleResize);
    }
  };
})();
