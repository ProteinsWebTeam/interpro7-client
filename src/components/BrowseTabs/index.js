import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';


import Link from 'components/generic/Link';
import {createSelector} from 'reselect';
import {entities, singleEntity} from 'menuConfig';
import loadData from 'higherOrder/loadData';
import SingleEntityMenu from 'components/Menu/SingleEntityMenu';

import styles from './style.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);

const BrowseTabs = ({pathname, data: {loading, payload}}) => {
  const parts = pathname.split('/');
  const endpoints = ['entry', 'protein', 'structure'];
  const NOT_FOUND = -1;
  if (parts.length > 1 && endpoints.indexOf(parts[1]) !== NOT_FOUND) {
    let tabs = [];
    if (!loading) {
      if (payload && 'results' in payload) {
        tabs = entities;
      }
      if (payload && 'metadata' in payload) {
        tabs = singleEntity;
      }
    }
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <ul className={f('tabs')}>
            {
              tabs.map((e, i) => (
                <li className={f('tabs-title')} key={i}>
                  <Link
                    to={e.to}
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
  } else if (parts.length > 1 && endpoints.indexOf(parts[1]) !== NOT_FOUND &&
    !loading && 'metadata' in payload) {
    return (
      <SingleEntityMenu pathname={pathname}/>
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
