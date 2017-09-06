// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';

import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import styles from './style.css';
import { foundationPartial } from 'styles/foundation';

const f = foundationPartial(styles);

/*:: type CounterProps = {
  name: string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
}; */

class Counter extends PureComponent /*:: <CounterProps> */ {
  static propTypes = {
    name: T.string.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
  };

  render() {
    const { name, data: { loading, payload } } = this.props;
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
  }
}

/*:: type BrowseTabsProps = {
  mainType: ?string,
  mainAccession: ?string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
}; */

class BrowseTabs extends PureComponent /*:: <BrowseTabsProps> */ {
  static propTypes = {
    mainType: T.string,
    mainAccession: T.string,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
  };

  render() {
    const { mainType, mainAccession, data } = this.props;
    let tabs = entities;
    if (mainAccession && mainType && config.pages[mainType]) {
      tabs = [singleEntity.get('overview')];
      for (const subPage of config.pages[mainType].subPages) {
        tabs.push(singleEntity.get(subPage));
      }
      tabs = tabs.filter(Boolean);
    }
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <ul className={f('tabs')}>
            {tabs.map(e => (
              <li className={f('tabs-title')} key={e.name}>
                <Link
                  newTo={e.newTo}
                  activeClass={f('is-active', 'is-active-tab')}
                >
                  <Counter name={e.name} data={data} />
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.mainAccession,
  (mainType, mainAccession) => ({ mainType, mainAccession })
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
    search
  ) => {
    if (!mainAccession) return '';
    return `${protocol}//${hostname}:${port}${root}${description2path({
      mainType,
      mainDB,
      mainAccession,
    })}?${qsStringify(search)}`.replace(/\?$/, '');
  }
);

export default loadData(mapStateToUrl)(connect(mapStateToProps)(BrowseTabs));
