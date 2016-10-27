/* @flow */
/* eslint no-magic-numbers: [1, {ignore: [0]}] */
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router/es';

import Badge from 'components/Badge';

import {buildLink} from 'utils/url';
import {singular, toPlural} from 'utils/pages';
import capitalize from 'lodash-es/capitalize';

import styles from './style.css';

const extractNumberFromData = data => {
  if (!data) return 0;
  if (Number.isInteger(data)) return data;
  if (Array.isArray(data)) return data.length;
  return 0;
};

export default (page/*: string */) => {
  const cleanedUpPage = page.trim().toLowerCase();
  // All of the *other* pages
  const pages = singular.filter(p => p !== cleanedUpPage);
  const PageNavigation = (
    {accession, counters, pathname}
    /*: {accession: string, counters: Object, pathname: string} */
  ) => {
    const current = pages.find(page => pathname.includes(page));
    return (
      <nav className={styles.nav}>
        <Link
          to={buildLink(pathname, accession)}
          style={{backgroundColor: current ? null : '#74bbd8'}}
        >
          summary
        </Link>
        {pages.map(p => {
          const plural = toPlural(p);
          return (
            <Link
              key={p}
              to={buildLink(pathname, accession, p)}
              style={{backgroundColor: (current === p) && '#74bbd8'}}
            >
              <Badge title={`number of distinct ${plural}`}>
                {extractNumberFromData(counters[plural])}
              </Badge>{plural}
            </Link>
          );
        })}
      </nav>
    );
  };
  PageNavigation.propTypes = {
    accession: T.string.isRequired,
    counters: T.object.isRequired,
    pathname: T.string.isRequired,
  };
  PageNavigation.displayName = `${capitalize(page)}PageNavigation`;

  return PageNavigation;
};
