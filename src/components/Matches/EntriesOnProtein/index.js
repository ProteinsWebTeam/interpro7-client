/* eslint no-magic-numbers: 0 */
import React, {PropTypes as T} from 'react';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const EntriesOnProtein = (
  {
    matches, options: {baseSize = 10, offset = 30, niceRatio = 6} = {},
  }
) => {
  const protein = matches[0].protein;
  const main = ('entry_protein_coordinates' in protein) ? 'protein' : 'entry';

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
          <text
            x="0.1em"
            y="0.8em"
            transform={`translate(${protein.length} 0)`}
          >
            <tspan>
              {protein.length}
            </tspan>
          </text>
        </g>
        <g>
          {
            matches.map(({[main]: {entry_protein_coordinates: {coordinates}}, entry}) => (
              <g
                key={entry.accession}
                transform={
                  `translate(${coordinates[0][0][0]} ${offset - baseSize})`
                }
              >
                  <title>{entry.accession}</title>
                  <rect
                    x="0" y="0" rx={baseSize * 2 / niceRatio}
                    width={coordinates[0][0][1] - coordinates[0][0][0]}
                    fill={colorHash.hex(entry.accession)}
                    height={baseSize * 2}
                    className={style.secondary}
                  />
                <text y="-0.2em">
                  <tspan textAnchor="middle">
                    {coordinates[0][0][0]}
                  </tspan>
                </text>
                <text
                  y="-0.2em"
                  transform={
                    `translate(${
                      coordinates[0][0][1] - coordinates[0][0][0]
                    } 0)`
                  }
                >
                  <tspan textAnchor="middle">
                    {coordinates[0][0][1]}
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
EntriesOnProtein.propTypes = {
  matches: T.arrayOf(T.shape({
    coordinates: T.arrayOf(T.object).isRequired,
    protein: T.object.isRequired,
    entry: T.object.isRequired,
  })).isRequired,
  options: T.object,
};

export default EntriesOnProtein;
