// @flow
export default (f/*: function */) => (e /*: Event */) => {
  e.preventDefault();
  e.stopPropagation();
  if (f) return f(e);
};
