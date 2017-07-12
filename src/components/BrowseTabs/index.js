// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';

import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

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
  ) {
    return null;
  }
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

const BrowseTabs = ({ mainType, mainAccession, data }) => {
  let tabs;
  if (mainAccession) {
    tabs = singleEntity.filter(e => e.type !== mainType);
  } else {
    tabs = entities;
  }
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
            </li>,
          )}
        </ul>
      </div>
    </div>
  );
};
BrowseTabs.propTypes = {
  mainType: T.string,
  mainAccession: T.string,
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.any,
  }).isRequired,
};

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.mainAccession,
  (mainType, mainAccession) => ({ mainType, mainAccession }),
);

const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainAccession,
  state => state.newLocation.search,
  (
    { protocol, hostname, port, root },
    mainType,
    mainDB,
    mainAccession,
    search,
  ) => {
    if (!mainAccession) return '';
    return `${protocol}//${hostname}:${port}${root}${description2path({
      mainType,
      mainDB,
      mainAccession,
    })}?${qsStringify(search)}`.replace(/\?$/, '');
  },
);

export default loadData(mapStateToUrl)(connect(mapStateToProps)(BrowseTabs));
