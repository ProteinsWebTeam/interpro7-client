/* eslint no-magic-numbers: 0 */
import React from 'react';
import T from 'prop-types';
import ColorHash from 'color-hash/lib/color-hash';

import loadable from 'higherOrder/loadable';

import style from '../style.css';

const colorHash = new ColorHash();

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@id': '@additionalProperty',
  additionalType: 'http://semanticscience.org/resource/SIO_001379.rdf',
  name: 'domain annotation',
  value: {
    '@type': ['StructuredValue', 'BioChemEntity', 'CreativeWork'],
    additionalType: 'http://semanticscience.org/resource/SIO_010043',
    identifier: data.protein.accession,
    name: data.protein.name,
    location: data.protein.entry_protein_locations.map(loc => ({
      '@type': 'PropertyValue',
      minValue: loc.fragments[0].start,
      maxValue: loc.fragments[0].end,
    })),
  },
});

const EntriesOnProtein = ({
  matches,
  options: { baseSize = 10, offset = 30, niceRatio = 6 /* , scale = 1*/ } = {},
}) => {
  const protein = matches[0].protein;
  const main = 'entry_protein_locations' in protein ? 'protein' : 'entry';
  return (
    <div className={style.svgContainer}>
      <SchemaOrgData data={matches[0]} processData={schemaProcessData} />
      <svg
        className={style.svg}
        preserveAspectRatio="xMinYMid meet"
        viewBox={`0 0 ${protein.length + offset} 60`}
      >
        <g transform={`translate(0 ${offset - baseSize / 2})`}>
          <title>{protein.accession}</title>
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
            <tspan>{protein.length}</tspan>
          </text>
        </g>
        <g>
          {matches.map(
            ({ [main]: { entry_protein_locations: locations }, entry }) =>
              locations.map((location, i) =>
                location.fragments.map((fragment, j) => (
                  <g
                    key={`${entry.accession}-${i}-${j}`}
                    transform={`translate(${fragment.start} ${offset -
                      baseSize})`}
                  >
                    <title>{entry.accession}</title>
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
                      <tspan textAnchor="middle">{fragment.start}</tspan>
                    </text>
                    <text
                      y="-0.2em"
                      transform={`translate(${fragment.end -
                        fragment.start} 0)`}
                    >
                      <tspan textAnchor="middle">{fragment.end}</tspan>
                    </text>
                  </g>
                )),
              ),
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
    }),
  ).isRequired,
  options: T.object,
};

export default EntriesOnProtein;
