import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import loadData from 'higherOrder/loadData';
import {getUrlForApi} from 'higherOrder/loadData/defaults';

import {singleEntity} from 'menuConfig';

import {memberDB} from 'staticData/home';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';

const styles = foundationPartial(ebiStyles);

const accessions = [
  ...memberDB,
  // InterPro
  'IPR[0-9]{6}',
  // UniProt
  '[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}',
  // PDB
  // '[0-9A-Z]{4}',
];
const dbAccs = new RegExp(
  `/(${accessions.map(db => db.accession).filter(db => db).join('|')})`,
  'i',
);

const mapStateToUrl = (...args) => {
  const defaultUrl = getUrlForApi(...args);
  const [queryString] = defaultUrl.match(/\?.*$/) || [''];
  const [base, acc] = defaultUrl.split(dbAccs);
  return base + acc + queryString;
};

const SingleEntityMenu = (
  {data: {payload: data}, pathname, className, children}
) => {
  let baseURL;
  try {
    baseURL = pathname.match(
      new RegExp(`^.*${data.metadata.accession}`, 'i')
    )[0];
  } catch (_) {
    // TODO: do something smarter
    return null;
  }
  const type = baseURL.match(/^\/?([^/]*)/)[1].toLowerCase();
  return (
    <ul className={className}>
      {children}
      {singleEntity
        .filter(({to}) => !to.includes(type))
        .map(({to, name, counter}) => (
          <li key={to}>
            <MenuItem
              to={baseURL + to}
              disabled={counter && !data.metadata.counters[counter]}
            >
              {name}&nbsp;
              {counter &&
              <span className={styles('badge')}>
                {data.metadata.counters[counter] || 0}
              </span>
              }
            </MenuItem>
          </li>
        ))
      }
    </ul>
  );
};
SingleEntityMenu.propTypes = {
  data: T.object.isRequired,
  isStale: T.bool.isRequired,
  pathname: T.string.isRequired,
  className: T.string,
  children: T.any,
};

export default loadData(mapStateToUrl)(SingleEntityMenu);
