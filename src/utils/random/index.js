// @flow
export default (
  from /*: number */ = 0,
  to /*: number */ = 1,
  int /*:: ?: boolean */,
) => {
  const value = Math.random() * (to - from) + from;
  if (!int) return value;
  return Math.round(value);
};
