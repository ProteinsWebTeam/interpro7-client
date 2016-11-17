// @flow
export const sticky = (
  window && window.CSS && window.CSS.supports('position', 'sticky') || false
);
