// @flow
export default (
  rel /*:: ?: string */,
  target /*:: ?: string */,
  href /*:: ?: string */,
  withReferrer /*:: ?: boolean */,
) => {
  if (!href) return rel;
  const relSet = new Set((rel || '').split(' ').filter(Boolean));
  if (!withReferrer) relSet.add('noreferrer');
  if (target && !withReferrer) relSet.add('noopener');
  if (!relSet.size) return;
  return Array.from(relSet).join(' ');
};
