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
    },
    pathname: string
  }*/
) => (
  <div className={styles.card}>
    <h2>{metadata.name.name}</h2>
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
  </div>
);
Title.propTypes = {
  metadata: T.object.isRequired,
  pathname: T.string.isRequired,
};

export default Title;
