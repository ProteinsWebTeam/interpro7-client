// @flow
export const sticky = (
  window && window.CSS && window.CSS.supports('position', 'sticky') || false
);

export const webComponents = window && 'customElements' in window;
