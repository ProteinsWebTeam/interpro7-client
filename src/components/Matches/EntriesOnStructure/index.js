/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
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
            }, entry}) =>
              coords_ep.map(
                (entryMatch, i) => entryMatch.map(
                  (regionMatch, j) => (
                    <g
                      key={`${entry.accession}-${i}-${j}`}
                      transform={
                        `translate(${regionMatch[0]} ${offset - baseSize / 2})`
                      }
                    >
                      <title>{entry.accession}</title>
                      <rect
                        x="0" y="0" rx={baseSize / niceRatio}
                        width={regionMatch[1] - regionMatch[0]}
                        height={baseSize}
                        fill={colorHash.hex(entry.accession)}
                        className={style.secondary}
                      />
                      <text y="-0.2em">
                        <tspan textAnchor="middle">
                          {regionMatch[0]}
                        </tspan>
                      </text>
                      <text
                        y="-0.2em"
                        transform={
                          `translate(${
                            regionMatch[1] - regionMatch[0]
                          } 0)`
                        }
                      >
                        <tspan textAnchor="middle">
                          {regionMatch[1]}
                        </tspan>
                      </text>
                    </g>
                  )
                )
              )
            )
          }
        </g>
        <g>
          {
            matches.map(({[main]: {
              protein_structure_coordinates: {coordinates: coords_sp},
            }}) =>
              coords_sp.map(
                (strMatch, i) => (
                  <g
                    key={`${structure.accession}-${i}`}
                    transform={
                      `translate(${strMatch[0]} ${offset - baseSize})`
                    }
                  >
                    <title>{structure.accession}</title>
                    <rect
                      x="0" y="0" rx={baseSize * 2 / niceRatio}
                      width={strMatch[1] - strMatch[0]}
                      height={baseSize * 2}
                      fill={colorHash.hex(structure.accession)}
                      className={style.secondary}
                    />
                    <text y="-0.2em">
                      <tspan textAnchor="middle">
                        {strMatch[0]}
                      </tspan>
                    </text>
                    <text
                      y="-0.2em"
                      transform={
                        `translate(${
                          strMatch[1] - strMatch[0]
                        } 0)`
                      }
                    >
                      <tspan textAnchor="middle">
                        {strMatch[1]}
                      </tspan>
                    </text>
                  </g>
                )
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
