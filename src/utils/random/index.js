// @flow
export default (
  from /*: number */ = 0,
  to /*: number */ = 1,
  doYouWantAnInteger /*:: ?: boolean */,
) => {
  const value = Math.random() * (to - from) + from;
  if (!doYouWantAnInteger) return value;
  return Math.round(value);
};
