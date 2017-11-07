// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import BrowseTabsLink from './BrowseTabsLink';

import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

/*:: type Props = {
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
}; */

export class BrowseTabsWithoutData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    isSignature: T.bool.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
  };

  render() {
    const { mainType, mainDB, mainAccession, data, isSignature } = this.props;
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
          <ul className={f('tabs', { sign: isSignature })}>
            {tabs.map(e => (
              <li className={f('tabs-title')} key={e.name}>
                <BrowseTabsLink
                  newTo={e.newTo}
                  name={e.name}
                  data={data}
                  counter={e.counter}
                  isFirstLevel={!mainAccession}
                  isSignature={isSignature}
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
    isSignature: !!(
      mainType === 'entry' &&
      mainDB !== 'InterPro' &&
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
    if (!mainAccession) return;
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
