// @flow
export const sticky = window ? CSS.supports('position', 'sticky') : false;
