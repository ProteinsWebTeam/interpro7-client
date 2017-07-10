/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const EntriesOnProtein = ({
  matches,
  options: { baseSize = 10, offset = 30, niceRatio = 6 /* , scale = 1*/ } = {},
}) => {
  const protein = matches[0].protein;
  const main = 'entry_protein_locations' in protein ? 'protein' : 'entry';
  return (
    <div className={style.svgContainer}>
      <svg
        className={style.svg}
        preserveAspectRatio="xMinYMid meet"
        viewBox={`0 0 ${protein.length + offset} 60`}
      >
        <g transform={`translate(0 ${offset - baseSize / 2})`}>
          <title>
            {protein.accession}
          </title>
          <rect
            x="0"
            y="0"
            rx={baseSize / niceRatio}
            width={protein.length}
            height={baseSize}
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
          {matches.map(
            ({ [main]: { entry_protein_locations: locations }, entry }) =>
              locations.map((location, i) =>
                location.fragments.map((fragment, j) =>
                  <g
                    key={`${entry.accession}-${i}-${j}`}
                    transform={`translate(${fragment.start} ${offset -
                      baseSize})`}
                  >
                    <title>
                      {entry.accession}
                    </title>
                    <rect
                      x="0"
                      y="0"
                      rx={baseSize * 2 / niceRatio}
                      width={fragment.end - fragment.start}
                      fill={colorHash.hex(entry.accession)}
                      height={baseSize * 2}
                      className={style.secondary}
                    />
                    <text y="-0.2em">
                      <tspan textAnchor="middle">
                        {fragment.start}
                      </tspan>
                    </text>
                    <text
                      y="-0.2em"
                      transform={`translate(${fragment.end -
                        fragment.start} 0)`}
                    >
                      <tspan textAnchor="middle">
                        {fragment.end}
                      </tspan>
                    </text>
                  </g>
                )
              )
          )}
        </g>
      </svg>
    </div>
  );
};
EntriesOnProtein.propTypes = {
  matches: T.arrayOf(
    T.shape({
      protein: T.object.isRequired,
      entry: T.object.isRequired,
    })
  ).isRequired,
  options: T.object,
};

export default EntriesOnProtein;
