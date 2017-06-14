// @flow
import React from 'react';
import T from 'prop-types';
import {Helmet} from 'react-helmet';

import Link from 'components/generic/Link';

import ipro from 'styles/interpro-new.css';

const formatter = new Intl.DateTimeFormat(
  'en-UK',
  {day: 'numeric', month: 'long', year: 'numeric'}
);

// TODO: Not specific to here, maybe move that somewhere else?
export const Time = (
  {date, children}/*: {date: string, children?: Node} */
) => (
  <time dateTime={date} title={date}>
    {children || formatter.format(Date.parse(date))}
  </time>
);
Time.propTypes = {
  date: T.string.isRequired,
  children: T.element,
};
const entryTypeColors = {
  F: ['#d41813', 'rgb(245, 69, 40)', 'rgb(212, 24, 19)'],
  D: ['#36a30f', 'rgb(80, 187, 48)', 'rgb(54, 163, 15)'],
  S: ['#a83cc9', '#c646ec', '#a83cc9'],
  R: ['#ff8511', '#ffa249', '#ff8511'],
  C: ['#1f64b3', '#1e77dc', '#1f64b3'],
  U: ['#737373', '#8c8c8c', '#737373'],
};
export const InterproSymbol = (
  {type, className = ''}
  /*: {
    type: string,
    className?: string,
  } */
) => {
  const colors = entryTypeColors[type[0]];
  const ch = (type === 'undefined') ? '?' : type[0];
  return (
    <svg
      viewBox="0 0 72 72"
      id={`type-${type}`}
      className={`${className}`}
    >
      <rect
        x="12" y="12" width="60" height="60"
        style={{fill: ('black'), opacity: 0.15}}
      />
      <rect
        x="4" y="4" width="60" height="60"
        strokeWidth="8" stroke={colors[0]}
        fill={colors[1]}
      />
      <polygon points="0,68 68,0 68,68" fill={colors[2]} />
      <text
        x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px"
        style={{
          fill: ('white'),
          fontSize: 60,
          fontWeight: 700,
          fontFamily: 'Montserrat, arial, serif',
        }}
      >
        {ch}
      </text>
      <text
        x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px"
        clipPath="url(#cut-off-bottom)"
        style={{
          fill: ('#e6e6e6'),
          fontSize: 60,
          fontWeight: 700,
          fontFamily: 'Montserrat, arial, serif',
        }}
      >
        {ch}
      </text>
    </svg>
  );
};
InterproSymbol.propTypes = {
  type: T.string.isRequired,
  className: T.string,
};

const Title = (
  {metadata, mainType}
  /*: {
    metadata: {
      name: {name: string, short: ?string},
      accession: string,
      source_database: string,
      type: string,
      gene?: string,
      experiment_type?: string,
      source_organism?: Object,
      release_date?: string,
      chains?: Array<string>,
    },
    mainType: string,
  } */
) => {
  const isEntry = mainType === 'entry';
  return (
    <div>
      {
        isEntry &&
        <div className={ipro['my-svg-container']}>
          <InterproSymbol type={metadata.type}/>
        </div>
      }
      <Helmet>
        <title>{metadata.accession}</title>
      </Helmet>
      <h3>{metadata.name.name} <small>({metadata.accession})</small></h3>
      {
        isEntry && metadata.source_database.toLowerCase() !== 'interpro' &&
        <div className={ipro['md-hlight']}>
          <h5>Member database:&nbsp;
            <Link
              newTo={{description: {
                mainType: 'entry',
                mainDB: metadata.source_database,
              }}}
            >
              {metadata.source_database}
            </Link>
          </h5>
        </div>
      }
      {
        metadata.name.short &&
        <p>Short name:&nbsp;
          <i className="small" style={{color: '#41647d'}}>
            {metadata.name.short}
          </i>
        </p>
      }
    </div>
  );
};
Title.propTypes = {
  metadata: T.object.isRequired,
  mainType: T.string.isRequired,
};

export default Title;
