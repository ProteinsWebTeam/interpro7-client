const defaultSelector = item => item;

export default ({
  selector = defaultSelector,
  descending = false,
} /*: {
  selector: (any => string) | (any => number),
  descending: boolean,
} */ = {}) => {
  return (a /*: any */, b /*: any */) => {
    const _a = selector(a);
    const _b = selector(b);
    if (_a > _b) return descending ? -1 : 1;
    if (_a < _b) return descending ? 1 : -1;
    return 0;
  };
};
