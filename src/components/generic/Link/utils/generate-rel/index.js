// @flow
export default (
  rel /*:: ?: string */,
  target /*:: ?: string */,
  href /*:: ?: string*/,
) => {
  if (!href) return rel;
  const relSet = new Set((rel || '').split(' ').filter(Boolean));
  relSet.add('noreferrer');
  if (target) relSet.add('noopener');
  return Array.from(relSet).join(' ');
};
