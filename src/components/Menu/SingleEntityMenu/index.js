import React from 'react';
import T from 'prop-types';

import MenuItem from 'components/Menu/MenuItem';

import {singleEntity} from 'menuConfig';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';

const styles = foundationPartial(ebiStyles);

const SingleEntityMenu = (
  {data, pathname, className, children}
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
              active={pathname === baseURL + to}
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
  pathname: T.string.isRequired,
  className: T.string,
  children: T.any,
};

export default SingleEntityMenu;
