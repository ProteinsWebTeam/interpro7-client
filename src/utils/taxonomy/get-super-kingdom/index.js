// @flow

export default (lineage /*: string */) => {
  if (lineage.includes(' 2759 ')) return 'Eukaryota';
  if (lineage.includes(' 2157 ')) return 'Archaea';
  if (lineage.includes(' 10239 ')) return 'Viruses';
  if (lineage.includes(' 12884 ')) return 'Viroids';
  if (lineage.includes(' 2 ')) return 'Bacteria';
};
