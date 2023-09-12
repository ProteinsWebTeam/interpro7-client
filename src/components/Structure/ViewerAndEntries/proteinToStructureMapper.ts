import { scaleLinear } from 'd3-scale';

export default (
  mapCoordinates: Array<{
    protein_start: number;
    protein_end: number;
    structure_start: number;
    structure_end: number;
    author_structure_start: number;
    author_structure_end: number;
  }>
) => {
  const protein2structure = scaleLinear();
  const coord = mapCoordinates
    .sort(({ protein_start: a }, { protein_start: b }) => a - b)
    .reduce(
      (agg, v) => {
        agg.domain.push(v.protein_start);
        agg.domain.push(v.protein_end);
        let start;
        let end;
        if (!v.author_structure_start && v.author_structure_end) {
          start =
            v.author_structure_end - (v.structure_end - v.structure_start);
          end = v.author_structure_end;
        } else if (!v.author_structure_start && !v.author_structure_end) {
          start = v.structure_start;
          end = v.structure_end;
        } else {
          start = v.author_structure_start;
          end = v.author_structure_end || v.structure_end;
        }
        agg.range.push(start);
        agg.range.push(end);
        return agg;
      },
      { domain: [], range: [] } as {
        domain: Array<number>;
        range: Array<number>;
      }
    );
  protein2structure.domain(coord.domain).range(coord.range);
  return protein2structure;
};
