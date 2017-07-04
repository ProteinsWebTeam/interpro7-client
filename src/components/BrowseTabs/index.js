// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';

import { singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';

import styles from './style.css';
import { foundationPartial } from 'styles/foundation';

const f = foundationPartial(styles);

const Counter = ({ name, data: { loading, payload } }) => {
  if (
    loading ||
    !(
      payload &&
      payload.metadata &&
      payload.metadata.counters &&
      Number.isFinite(payload.metadata.counters[name])
    )
  )
    return null;
  return (
    <span>
      <NumberLabel
        value={payload.metadata.counters[name]}
        className={f('counter')}
      />
      &nbsp;
    </span>
  );
};
Counter.propTypes = {
  name: T.string.isRequired,
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.any,
  }).isRequired,
};

const BrowseTabs = ({ mainType, data }) => {
  const tabs = singleEntity.filter(e => e.type !== mainType);
  return (
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <ul className={f('tabs')}>
          {tabs.map(e =>
            <li className={f('tabs-title')} key={e.name}>
              <Link
                newTo={e.newTo}
                activeClass={f('is-active', 'is-active-tab')}
              >
                <Counter name={e.name} data={data} />
                {e.name}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
BrowseTabs.propTypes = {
  mainType: T.string,
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.any,
  }).isRequired,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  mainType => ({ mainType })
);

const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainAccession,
  ({ protocol, hostname, port, root }, type, db, accession) =>
    `${protocol}//${hostname}:${port}${root}${type}/${db}/${accession}`
);

export default loadData(mapStateToUrl)(connect(mapStateToProps)(BrowseTabs));
