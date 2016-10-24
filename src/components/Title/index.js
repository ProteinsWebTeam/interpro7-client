/* @flow */
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es6';

import TypeTag from 'components/TypeTag';
import {
  Name, OriginDB, SourceOrganism,
} from 'components/SimpleCommonComponents';

import {buildLink} from 'utils/url';

import styles from 'styles/blocks.css';

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

const InterproSymbol = ({type})=> (
  <svg width="90" height="70" id="name">
    <g>
      <rect x="10" y="10" width="60" height="60"
            style={{
              fill: 'black',
              opacity: 0.1,
            }}/>
      <rect x="0" y="0" width="60" height="60"
            style={{
              fill: '#ee2a09',
              stroke: '#d41813',
              strokeWidth: 10,
              opacity: 1,
              position: 'absolute',
              left: 0,
              top:0,
            }}/>
      <text x="10" y="62" fill="white" fontFamily="Arial" fontWeight="bold" fontSize="70" style={{
        boxShadow: "black 10px 10px 10px;",
      }}> {type[0]} </text>
    </g>
    Sorry, your browser does not support inline SVG.
  </svg>
);
const Title = (
  {metadata, pathname}
  /*: {
    metadata: {
      name: {name: string, short: ?string},
      accession: string,
      source_database: string,
      type?: string,
      gene?: string,
      experiment_type?: string,
      source_organism?: Object,
      release_date?: string,
      chains?: Array<string>,
    },
    pathname: string
  }*/
) => (
  <div className={styles.card}>
    <div style={{float: 'left'}}>
      {
        pathname.startsWith('/entry') &&
        <InterproSymbol type={metadata.type}/>
      }
    </div>
    <h3>{metadata.name.name}<small>({metadata.accession})</small></h3>


  </div>
);
Title.propTypes = {
  metadata: T.object.isRequired,
  pathname: T.string.isRequired,
};

export default Title;
/*

 <div>
 {metadata.type && <TypeTag type={metadata.type} full={true} />}
 <Name name={metadata.name} accession={metadata.accession} />
 <OriginDB
 source={metadata.source_database}
 pathname={pathname}
 accession={metadata.accession}
 />
 {metadata.gene && <p>Gene: {metadata.gene}</p>}
 {
 metadata.experiment_type &&
 <p>Experiment Type: {metadata.experiment_type}</p>
 }
 {
 metadata.source_organism &&
 <SourceOrganism {...metadata.source_organism} />
 }
 {
 metadata.release_date &&
 <p>Release Date: <Time date={metadata.release_date} /></p>
 }
 {
 metadata.chains && metadata.chains.length &&
 <ul>Chains:
 {metadata.chains.map(c => (
 <li key={c}>
 <Link to={buildLink(pathname, metadata.accession, c)}>
 Chain {c}
 </Link>
 </li>
 ))}
 </ul>
 }
 </div>
 */
