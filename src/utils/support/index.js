// @flow

// If we don't have a window, we're not in a browser, so we don't really care if
// those are supported or not, and we don't want to load polyfills

export const sticky =
  !window || (window.CSS && window.CSS.supports('position', 'sticky'));

export const webComponents = !window || 'customElements' in window;

export const webAnimations =
  !window ||
  (window.document &&
    window.document.body &&
    'animate' in window.document.body);

export const detailsTag = (window => {
  if (!window) return true; // no need for a polyfill if not in browser
  return window.document.createElement('details').open !== undefined;
})(window);

export const inert = !window || 'inert' in HTMLElement.prototype;
