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

const singleEntityNames = new Map(
  Array.from(singleEntity).map(e => [e[1].name, e[0]]),
);

/*:: type CounterProps = {
  newTo: Object | function,
  name: string,
  counter: string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  isFirstLevel?: boolean,
}; */

const whitelist = new Set(['Overview', 'Domain Architectures', 'Sequence']);

class Counter extends PureComponent /*:: <CounterProps> */ {
  static propTypes = {
    newTo: T.oneOfType([T.object, T.func]).isRequired,
    name: T.string.isRequired,
    counter: T.string,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isFirstLevel: T.bool,
  };

  render() {
    const {
      newTo,
      name,
      counter,
      data: { loading, payload },
      isFirstLevel,
    } = this.props;
    let value = null;
    if (!loading && payload && payload.metadata) {
      if (
        payload.metadata.counters &&
        Number.isFinite(payload.metadata.counters[counter])
      ) {
        value = payload.metadata.counters[counter];
      } // Enabling the menuitems that appear in the entry_annotations array.
      // i.e. only enable the menu item if there is info for it
      if (
        payload.metadata.entry_annotations &&
        payload.metadata.entry_annotations.indexOf(
          singleEntityNames.get(name),
        ) >= 0
      ) {
        value = NaN;
      }
      // TODO: find a generic way to deal with this:
      if (whitelist.has(name)) value = NaN;
      if (
        name === 'Domain Architectures' &&
        payload.metadata.counters &&
        !payload.metadata.counters.proteins
      ) {
        value = 0;
      }
    }

    return (
      <Link
        newTo={newTo}
        activeClass={f('is-active', 'is-active-tab')}
        disabled={!isFirstLevel && !isNaN(value) && !value}
      >
        {name}
        {value !== null && ' '}
        {value !== null &&
          !isNaN(value) && (
            <NumberLabel value={value} className={f('counter')} />
          )}
      </Link>
    );
  }
}

/*:: type BrowseTabsProps = {
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
}; */

export class BrowseTabsWithoutData extends PureComponent /*:: <BrowseTabsProps> */ {
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    issignature: T.bool.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
  };

  render() {
    const { mainType, mainDB, mainAccession, data, issignature } = this.props;
    let tabs = entities;
    if (mainAccession && mainType && config.pages[mainType]) {
      tabs = [singleEntity.get('overview')];
      for (const subPage of config.pages[mainType].subPages) {
        if (!(mainDB === 'proteome' && subPage === 'proteome'))
          tabs.push(singleEntity.get(subPage));
      }
      tabs = tabs.filter(Boolean);
    }
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <ul className={f('tabs', { sign: issignature })}>
            {tabs.map(e => (
              <li className={f('tabs-title')} key={e.name}>
                <Counter
                  newTo={e.newTo}
                  name={e.name}
                  data={data}
                  counter={e.counter}
                  isFirstLevel={!mainAccession}
                />
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
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainAccession,
  (mainType, mainDB, mainAccession) => ({
    mainType,
    mainDB,
    mainAccession,
    iissignature: !!(
      mainType === 'entry' &&
      mainDB.toLowerCase() !== 'interpro' &&
      mainAccession
    ),
  }),
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

export default loadData(mapStateToUrl)(
  connect(mapStateToProps)(BrowseTabsWithoutData),
);
