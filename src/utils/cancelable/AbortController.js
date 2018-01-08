// @flow
export default (support => {
  if (support) return window.AbortController;
  return class AbortController {
    abort() {}
  };
})(window && 'AbortController' in window);
