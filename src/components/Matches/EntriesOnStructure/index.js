/* eslint no-magic-numbers: 0 */
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router-dom';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const EntriesOnStructure = (
  {
    matches, options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  }
) => {
  const structure = matches[0].structure;
  // TODO: change that!
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
            to={`/structure/${
              structure.source_database
            }/${structure.accession}/`}
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
            matches.map(({coordinates: coords, entry}) => (
              <g
                key={entry.accession}
                transform={
                  `translate(${coords[0].structure[0]} ${offset - baseSize})`
                }
              >
                <Link
                  to={`/entry/${entry.source_database}/${entry.accession}`}
                >
                  <title>{entry.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize * 2 / niceRatio}
                    width={coords[0].structure[1] - coords[0].structure[0]}
                    height={baseSize * 2}
                    fill={colorHash.hex(entry.accession)}
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
EntriesOnStructure.propTypes = {
  matches: T.arrayOf(T.shape({
    coordinates: T.arrayOf(T.object).isRequired,
    structure: T.object.isRequired,
    entry: T.object.isRequired,
  })).isRequired,
  options: T.object,
};

export default EntriesOnStructure;
