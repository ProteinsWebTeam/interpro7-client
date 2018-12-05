import { scaleLinear } from 'd3';

export default mapCoordinates => {
  const protein2structure = scaleLinear();
  const coord = mapCoordinates
    .sort(({ protein_start: a }, { protein_start: b }) => a - b)
    .reduce(
      (agg, v) => {
        agg.domain.push(v.protein_start);
        agg.domain.push(v.protein_end);
        agg.range.push(v.author_structure_start || v.structure_start);
        agg.range.push(v.author_structure_end || v.structure_end);
        return agg;
      },
      { domain: [], range: [] },
    );
  protein2structure.domain(coord.domain).range(coord.range);
  return protein2structure;
};
