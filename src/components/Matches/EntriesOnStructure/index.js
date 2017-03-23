/* eslint no-magic-numbers: 0 */
import React, {PropTypes as T} from 'react';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const EntriesOnStructure = (
  {
    matches, options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  }
) => {
  const structure = matches[0].structure;
  const main = ('entry_protein_coordinates' in structure) ? 'structure' : 'entry';
  const length = matches[0][main].entry_protein_coordinates.length;
  return (
    <div className={style.svgContainer}>
      <svg
        className={style.svg}
        preserveAspectRatio="xMinYMid meet"
        viewBox={`0 0 ${length + offset} 60`}
        width={length}
      >
        <g transform={`translate(0 ${offset - baseSize / 2})`}>
          <rect
            x="0" y="0" rx={baseSize / niceRatio}
            width={length} height={baseSize}
            className={style.primary}
          />
          <text y="-0.2em" transform={`translate(${length} 0)`}>
            <tspan textAnchor="end">
              {length}
            </tspan>
          </text>
        </g>
        <g>
          {
            matches.map(({[main]: {
              entry_protein_coordinates: {coordinates: coords_ep},
            }, entry}) => (
                <g
                  key={entry.accession}
                  transform={
                    `translate(${coords_ep[0][0][0]} ${offset - baseSize / 2})`
                  }
                >
                  <title>{entry.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize / niceRatio}
                    width={coords_ep[0][0][1] - coords_ep[0][0][0]}
                    height={baseSize}
                    fill={colorHash.hex(entry.accession)}
                    className={style.secondary}
                  />
                  <text y="-0.2em">
                    <tspan textAnchor="middle">
                      {coords_ep[0][0][0]}
                    </tspan>
                  </text>
                  <text
                    y="-0.2em"
                    transform={
                      `translate(${
                      coords_ep[0][0][1] - coords_ep[0][0][0]
                        } 0)`
                    }
                  >
                    <tspan textAnchor="middle">
                      {coords_ep[0][0][1]}
                    </tspan>
                  </text>
                </g>
              )
            )
          }
        </g>
        <g>
          {
            matches.map(({[main]: {
                           protein_structure_coordinates: {coordinates: coords_sp},
                         }}) => (
                <g
                  key={structure.accession}
                  transform={
                    `translate(${coords_sp[0][0][0]} ${offset - baseSize})`
                  }
                >
                  <title>{structure.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize * 2 / niceRatio}
                    width={coords_sp[0][0][1] - coords_sp[0][0][0]}
                    height={baseSize * 2}
                    fill={colorHash.hex(structure.accession)}
                    className={style.secondary}
                  />
                  <text y="-0.2em">
                    <tspan textAnchor="middle">
                      {coords_sp[0][0][0]}
                    </tspan>
                  </text>
                  <text
                    y="-0.2em"
                    transform={
                      `translate(${
                      coords_sp[0][0][1] - coords_sp[0][0][0]
                        } 0)`
                    }
                  >
                    <tspan textAnchor="middle">
                      {coords_sp[0][0][1]}
                    </tspan>
                  </text>
                </g>
              )
            )
          }
        </g>
      </svg>
    </div>
  );
};
EntriesOnStructure.propTypes = {
  matches: T.arrayOf(T.shape({
    coordinates: T.arrayOf(T.object).isRequired,
    structure: T.object.isRequired,
    entry: T.object.isRequired,
  })).isRequired,
  options: T.object,
};

export default EntriesOnStructure;
