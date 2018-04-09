// @flow
export default (f /*: function */) => (e /*: Event */) => {
  e.preventDefault();
  e.stopPropagation();
  return f(e);
};
