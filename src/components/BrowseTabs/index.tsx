import React, { PropsWithChildren, PureComponent } from 'react';

import { createSelector } from 'reselect';

import BrowseTabsLink from './BrowseTabsLink';

import config from 'config';
import { entities, singleEntity } from 'menuConfig';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import { connect } from 'react-redux';

const f = cssBinder(styles);

type Props = PropsWithChildren<{
  mainType?: string;
  mainDB?: string | null;
  mainAccession?: string | null;
  isSignature?: boolean;
  metadata: Metadata;
  className?: string;
}>;

export class BrowseTabsWithoutData extends PureComponent<Props> {
  render() {
    const {
      mainType,
      mainDB,
      mainAccession,
      metadata,
      isSignature,
      children,
      className,
    } = this.props;
    let tabs = entities;
    if (mainAccession && mainType && config.pages[mainType]) {
      const overview = singleEntity.get('overview');
      if (overview) {
        tabs = [overview];
        for (const subPage of config.pages[mainType].subPages) {
          if (!(mainDB === 'proteome' && subPage === 'proteome')) {
            const sp = singleEntity.get(subPage);
            if (sp) tabs.push(sp);
          }
        }
        tabs = tabs.filter(Boolean);
      }
    }
    return (
      <ul
        className={f('tabs', 'pp-browse-tabs', className, {
          sign: isSignature,
        })}
      >
        {
          // used for both InterProScan result page
        }
        {children}
        {tabs.map((e) => (
          <li className={f('tabs-title')} key={e.name}>
            <BrowseTabsLink
              to={e.to!}
              exact={e.exact}
              name={e.name}
              metadata={metadata}
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
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].db,
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].accession,
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

export default connect(mapStateToProps)(BrowseTabsWithoutData);
