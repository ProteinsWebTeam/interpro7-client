/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const ProteinsOnStructure = (
  {
    matches, options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  }
) => {
  const structure = matches[0].structure;
  // TODO: remove this!
  structure.length = 250;
  return (
    <div className={style.svgContainer}>
      <svg
        className={style.svg}
        preserveAspectRatio="xMinYMid meet"
        width={structure.length}
      >
        <g transform={`translate(0 ${offset - baseSize / 2})`}>
          <Link
            newTo={{description: {
              mainType: 'structure',
              mainDB: structure.source_database,
              mainAccession: structure.accession,
            }}}
          >
            <title>{structure.accession}</title>
            <rect
              x="0" y="0" rx={baseSize / niceRatio}
              width={structure.length} height={baseSize}
              className={style.primary}
            />
          </Link>
          <text y="-0.2em" transform={`translate(${structure.length} 0)`}>
            <tspan textAnchor="end">
              {structure.length}
            </tspan>
          </text>
        </g>
        <g>
          {
            matches.map(({coordinates: coords, protein}) => (
              <g
                key={protein.accession}
                transform={
                  `translate(${coords[0].structure[0]} ${offset - baseSize})`
                }
              >
                <Link
                  newTo={{description: {
                    mainType: 'protein',
                    mainDB: protein.source_database,
                    mainAccession: protein.accession,
                  }}}
                >
                  <title>{protein.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize * 2 / niceRatio}
                    width={coords[0].structure[1] - coords[0].structure[0]}
                    fill={colorHash.hex(protein.accession)}
                    height={baseSize * 2}
                    className={style.secondary}
                  />
                </Link>
                <text y="-0.2em">
                  <tspan textAnchor="middle">
                    {coords[0].structure[0]}
                  </tspan>
                </text>
                <text
                  y="-0.2em"
                  transform={
                    `translate(${
                      coords[0].structure[1] - coords[0].structure[0]
                    } 0)`
                  }
                >
                  <tspan textAnchor="middle">
                    {coords[0].structure[1]}
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
ProteinsOnStructure.propTypes = {
  matches: T.arrayOf(T.shape({
    coordinates: T.arrayOf(T.object).isRequired,
    structure: T.object.isRequired,
    protein: T.object.isRequired,
  })).isRequired,
  options: T.object,
};

export default ProteinsOnStructure;
