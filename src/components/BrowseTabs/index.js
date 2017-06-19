import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';


import Link from 'components/generic/Link';
import {createSelector} from 'reselect';
import {singleEntity} from 'menuConfig';
import loadData from 'higherOrder/loadData';

import styles from './style.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);

const BrowseTabs = ({mainType}) => {
  const tabs = singleEntity.filter(e => e.type !== mainType);
  return (
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <ul className={f('tabs')}>
          {
            tabs.map(e => (
              <li className={f('tabs-title')} key={e.name}>
                <Link
                  newTo={e.newTo}
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
};
BrowseTabs.propTypes = {
  mainType: T.string,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({mainType})
);

export default loadData()(connect(mapStateToProps)(BrowseTabs));
