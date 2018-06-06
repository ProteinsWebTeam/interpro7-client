// @flow
export const sticky =
  (window && window.CSS && window.CSS.supports('position', 'sticky')) || false;

export const webComponents = window && 'customElements' in window;

export const webAnimations =
  window &&
  window.document &&
  window.document.body &&
  'animate' in window.document.body;

export const detailsTag = (window => {
  if (!window) return true; // no need for a polyfill if not in browser
  return window.document.createElement('details').open !== undefined;
})(window);
