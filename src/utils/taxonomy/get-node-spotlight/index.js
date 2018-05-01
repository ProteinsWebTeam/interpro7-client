// @flow

export default (lineage /*: string */) => {
  if (lineage.includes(' 1224 ')) return 'Proteobacteria';
  if (lineage.includes(' 201174 ')) return 'Actinobacteria';
  if (lineage.includes(' 203691 ')) return 'Spirochaetes';
  if (lineage.includes(' 203682 ')) return 'Planctomycetes';
  if (lineage.includes(' 1239 ')) return 'Firmicutes';
  if (lineage.includes(' 976 ')) return 'Bacteroidetes';
  if (lineage.includes(' 40674 ')) return 'Mammalia';
  if (lineage.includes(' 6656 ')) return 'Arthropoda';
  if (lineage.includes(' 33090 ')) return 'Viridiplantae';
  if (lineage.includes(' 6231 ')) return 'Nematoda';
  if (lineage.includes(' 8782 ')) return 'Birds';
  if (lineage.includes(' 4751 ')) return 'Fungi';
  if (lineage.includes(' 32561 ')) return 'Sauria';
  if (lineage.includes(' 7898 ')) return 'Fish';
};
