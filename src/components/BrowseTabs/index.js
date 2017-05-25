import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import styles from './style.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);

import Link from 'components/generic/Link';
import {createSelector} from 'reselect';

import {entities} from 'menuConfig';
import loadData from 'higherOrder/loadData';

const BrowseTabs = ({pathname, data: {loading, payload}}) => {
  const parts = pathname.split('/');
  const endpoints = ['entry', 'protein', 'structure'];
  if (parts.length > 1 && endpoints.indexOf(parts[1]) !== -1 &&
    !loading && 'results' in payload) {
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <ul className={f('tabs')}>
            {
              entities.map((e, i) => (
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
  }
  return null;
};
const mapStateToProps = createSelector(
  state => state.location.pathname,
  (pathname) => ({pathname})
);

export default loadData()(connect(mapStateToProps)(BrowseTabs));
