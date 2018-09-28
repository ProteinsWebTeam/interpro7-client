import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import BrowseTabsLink from './BrowseTabsLink';

import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

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
  isSignature?: boolean,
  children: ?any,
  className: ?string,
}; */

export class BrowseTabsWithoutData extends PureComponent /*:: <Props> */ {
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    isSignature: T.bool,
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
      <ul
        className={f('tabs', 'pp-browse-tabs', className, {
          sign: isSignature,
        })}
      >
        {children}
        {tabs.map(e => (
          <li className={f('tabs-title')} key={e.name}>
            <BrowseTabsLink
              to={e.to}
              exact={e.exact}
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
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
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
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, key, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key },
          [key]: { db, accession },
        }),
    });
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  BrowseTabsWithoutData,
);
