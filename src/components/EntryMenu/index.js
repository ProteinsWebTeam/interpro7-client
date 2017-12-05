// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import EntryMenuLink from './EntryMenuLink';

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
  children: ?any,
  className: ?string,
}; */

export class EntryMenuWithoutData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    isSignature: T.bool.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    children: T.any,
    className: T.string,
  };

  render() {
    const {
      mainType,
      mainDB,
      mainAccession,
      data,
      isSignature,
      children,
      data: { payload },
      className,
    } = this.props;
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
      <ul className={f('tabs', className, { sign: isSignature })}>
        {children}
        {tabs.map(e => (
          <li className={f('tabs-title')} key={e.name}>
            <EntryMenuLink
              metadata={payload.metadata}
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
  ({ protocol, hostname, port, root }, mainType, mainDB, mainAccession) => {
    if (!mainAccession) return;
    return `${protocol}//${hostname}:${port}${root}${description2path({
      mainType,
      mainDB,
      mainAccession,
    })}`.replace(/\?$/, '');
  },
);

export default loadData(mapStateToUrl)(
  connect(mapStateToProps)(EntryMenuWithoutData),
);
