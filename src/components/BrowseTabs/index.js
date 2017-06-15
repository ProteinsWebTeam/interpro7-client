import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';


import Link from 'components/generic/Link';
import {createSelector} from 'reselect';
import {entities, singleEntity} from 'menuConfig';
import loadData from 'higherOrder/loadData';

import styles from './style.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);
const NOT_FOUND = -1;

const BrowseTabs = ({pathname, data: {loading, payload}}) => {
  const parts = pathname.split('/');
  const endpoints = ['entry', 'protein', 'structure'];
  let isRelativePath = false;
  let base = pathname;
  if (parts.length > 1 && endpoints.indexOf(parts[1]) !== NOT_FOUND) {
    let tabs = [];
    if (!loading) {
      if (payload && 'results' in payload) {
        tabs = entities;
      }
      if (payload && 'metadata' in payload || parts[4] === 'domain_architecture') {
        tabs = singleEntity.filter(a => a.to.indexOf(parts[1]) === NOT_FOUND);
        base = tabs.reduce(
          (acc, v) => v.to === '/' ? acc : acc.replace(v.to, ''), base
        );
        isRelativePath = true;
      }
    }
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <ul className={f('tabs')}>
            {
              tabs.map(e => (
                <li className={f('tabs-title')} key={e.name}>
                  <Link
                    to={isRelativePath ? base + e.to : e.to}
                    activeClass={f('is-active', 'is-active-tab')}
                  >
                    {e.name}
                  </Link>
                </li>

              ))
            }
          </ul>
        </div>
      </div>
    );
  }
  return null;
};
BrowseTabs.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.object,
  }),
  pathname: T.string,
};

const mapStateToProps = createSelector(
  state => state.location.pathname,
  (pathname) => ({pathname})
);

export default loadData()(connect(mapStateToProps)(BrowseTabs));
