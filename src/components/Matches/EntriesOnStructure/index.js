/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import ColorHash from 'color-hash/lib/color-hash';

import style from '../style.css';

const colorHash = new ColorHash();

const EntriesOnStructure = ({
  matches,
  options: { baseSize = 10, offset = 30, niceRatio = 6 } = {},
}) => {
  const structure = matches[0].structure;
  const main = 'entry_protein_locations' in structure ? 'structure' : 'entry';
  const length = matches[0][main].protein_length;
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
            x="0"
            y="0"
            rx={baseSize / niceRatio}
            width={length}
            height={baseSize}
            className={style.primary}
          />
          <text y="-0.2em" transform={`translate(${length} 0)`}>
            <tspan textAnchor="end">
              {length}
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
                      baseSize / 2})`}
                  >
                    <title>
                      {entry.accession}
                    </title>
                    <rect
                      x="0"
                      y="0"
                      rx={baseSize / niceRatio}
                      width={fragment.end - fragment.start}
                      height={baseSize}
                      fill={colorHash.hex(entry.accession)}
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
                  </g>,
                ),
              ),
          )}
        </g>
        <g>
          {matches.map(
            ({ [main]: { protein_structure_locations: locations } }) =>
              locations.map((location, i) =>
                location.fragments.map((fragment, j) =>
                  <g
                    key={`${structure.accession}-${i}-${j}`}
                    transform={`translate(${fragment.start} ${offset -
                      baseSize})`}
                  >
                    <title>
                      {structure.accession}
                    </title>
                    <rect
                      x="0"
                      y="0"
                      rx={baseSize * 2 / niceRatio}
                      width={fragment.end - fragment.start}
                      height={baseSize * 2}
                      fill={colorHash.hex(structure.accession)}
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
                  </g>,
                ),
              ),
          )}
        </g>
      </svg>
    </div>
  );
};
EntriesOnStructure.propTypes = {
  matches: T.arrayOf(
    T.shape({
      structure: T.object.isRequired,
      entry: T.object.isRequired,
    }),
  ).isRequired,
  options: T.object,
};

export default EntriesOnStructure;
