/* eslint no-magic-numbers: 0 */
import React, {PropTypes as T} from 'react';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const StructureOnProtein = (
  {
    matches, options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  }
) => {
  const protein = matches[0].protein;
  return (
    <div className={style.svgContainer}>
      <svg
        className={style.svg}
        preserveAspectRatio="xMinYMid meet"
        viewBox={`0 0 ${protein.length + offset} 60`}
      >
        <g transform={`translate(0 ${offset - baseSize / 2})`}>
          <title>{protein.accession}</title>
          <rect
            x="0" y="0" rx={baseSize / niceRatio}
            width={protein.length} height={baseSize}
            className={style.primary}
          />
          <text x="0.1em" y="0.8em" transform={`translate(${protein.length} 0)`}>
            <tspan>{protein.length}</tspan>
          </text>
        </g>
        <g>
          {
            matches.map(({coordinates: coords, structure}) => (
              <g
                key={structure.accession}
                transform={
                  `translate(${coords[0].structure[0]} ${offset - baseSize})`
                }
              >
                  <title>{structure.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize * 2 / niceRatio}
                    width={coords[0].structure[1] - coords[0].structure[0]}
                    fill={colorHash.hex(structure.accession)}
                    height={baseSize * 2}
                    className={style.secondary}
                  />
                <text y="-0.2em">
                  <tspan textAnchor="middle">
                    {coords[0].protein[0]}
                  </tspan>
                </text>
                <text
                  y="-0.2em"
                  transform={
                    `translate(${
                      coords[0].protein[1] - coords[0].protein[0]
                    } 0)`
                  }
                >
                  <tspan textAnchor="middle">
                    {coords[0].protein[1]}
                  </tspan>
                </text>
              </g>
            ))
          }
        </g>
      </svg>
    </div>
  );
};
StructureOnProtein.propTypes = {
  matches: T.arrayOf(T.shape({
    coordinates: T.arrayOf(T.object).isRequired,
    structure: T.object.isRequired,
    protein: T.object.isRequired,
  })).isRequired,
  options: T.object,
};

export default StructureOnProtein;
