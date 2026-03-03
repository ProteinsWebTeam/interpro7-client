import React, { PureComponent, PropsWithChildren } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import config from 'config';
import { MenuItemProps, entities, singleEntity } from 'menuConfig';

import loadData from 'higherOrder/loadData/ts';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';
import EntryMenuLink from './EntryMenuLink';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

import entryMenuLinkClasses from './EntryMenuLink/style.css';

const css = cssBinder(styles, fonts);

const mapNameToClass = new Map([
  ['domain', 'menu-domain'],
  ['family', 'menu-family'],
  ['repeat', 'menu-repeat'],
  ['conserved_site', 'menu-site'],
  ['binding_site', 'menu-site'],
  ['active_site', 'menu-site'],
  ['ptm', 'menu-site'],
  ['homologous_superfamily', 'menu-hh'],
]);

type Props = PropsWithChildren<{
  mainType?: string;
  mainDB?: string;
  mainAccession?: string;
  isSignature?: boolean;
  className?: string;
  lowGraphics?: boolean;
  usedOnTheSide?: boolean;
  width?: number;
}>;

type State = {
  topBorder: number;
  isCollapsed: boolean;
};
interface LoadedProps extends Props, LoadDataProps<{ metadata: Metadata }> {}

export class EntryMenuWithoutData extends PureComponent<LoadedProps, State> {
  _ref = React.createRef<HTMLUListElement>();

  constructor(props: LoadedProps) {
    super(props);

    this._ref = React.createRef();
    this.state = {
      topBorder: 0,
      isCollapsed: false,
    };
  }

  componentDidMount() {
    this._moveFakeBorder();
  }

  componentDidUpdate(_: LoadedProps, prevState: State) {
    const DELAY = 300;
    if (this.state.isCollapsed === prevState.isCollapsed) {
      this._moveFakeBorder();
    } else {
      setTimeout(() => this._moveFakeBorder(), DELAY);
    }
  }

  _moveFakeBorder = () => {
    if (!this._ref.current) return;
    const newTarget = this._ref.current.querySelector(
      `a.${entryMenuLinkClasses['is-active-tab']}`,
    );
    if (!newTarget) return;

    const containerBoundingRect = this._ref.current.getBoundingClientRect();
    const boundingRect = newTarget.getBoundingClientRect();

    this.setState({
      topBorder:
        1 +
          boundingRect.top +
          boundingRect.height -
          containerBoundingRect.top -
          parseFloat(
            window
              .getComputedStyle(newTarget)
              .getPropertyValue('padding-bottom'),
          ) || 0,
    });
  };

  render() {
    const {
      mainType,
      mainAccession,
      data,
      isSignature,
      children,
      className,
      usedOnTheSide,
    } = this.props;
    if (!data) return null;
    const { loading, payload } = data;
    let tabs: Array<MenuItemProps | undefined> = entities;
    if (mainAccession && mainType && config.pages[mainType]) {
      tabs = [singleEntity.get('overview')];
      for (const subPage of config.pages[mainType].subPages) {
        tabs.push(singleEntity.get(subPage));
      }
      tabs = tabs.filter(Boolean);
    }
    if (loading || !payload || !payload.metadata) {
      return <Loading />;
    }
    return (
      <ul
        className={css('tabs', className, {
          sign: isSignature,
          onside: usedOnTheSide,
          collapsed: this.state.isCollapsed,
        })}
        ref={this._ref}
        data-testid="menu"
      >
        {!usedOnTheSide && (
          <nav className={css('collapse-bar')}>
            <button
              className={css('icon', 'icon-common', 'icon-backward')}
              onClick={() =>
                this.setState({ isCollapsed: !this.state.isCollapsed })
              }
            />
          </nav>
        )}
        <span
          data-testid="entry-menu"
          className={css(
            'fake-border',
            payload.metadata.source_database.toLowerCase() === 'interpro'
              ? mapNameToClass.get((payload.metadata as EntryMetadata).type)
              : null,
            { ['is-signature']: isSignature },
          )}
          style={{
            top: this.state?.topBorder || 0,
          }}
        />
        {children}
        {(tabs as Array<MenuItemProps>).map((e) => (
          <EntryMenuLink
            key={e.name}
            to={e.to}
            exact={e.exact}
            // activeClass={e.activeClass}
            name={e.name}
            data={data}
            counter={e.counter}
            isFirstLevel={!mainAccession}
            usedOnTheSide={usedOnTheSide}
            collapsed={this.state.isCollapsed}
          />
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
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].accession,
  (state: GlobalState) =>
    Object.entries(state.customLocation.description)
      .filter(
        ([_, endpoint]) =>
          !Array.isArray(endpoint) && (endpoint as EndpointLocation)?.isFilter,
      )
      .map(([f]) => f),

  (state: GlobalState) => state.settings.ui.lowGraphics,
  (mainType, mainDB, mainAccession, lowGraphics) => ({
    mainType,
    mainDB,
    mainAccession,
    isSignature: !!(
      mainType === 'entry' &&
      mainDB !== 'InterPro' &&
      mainAccession
    ),
    lowGraphics,
  }),
);

const mapStateToUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].db,
  (state: GlobalState) =>
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].accession,
  ({ protocol, hostname, port, root }, mainType, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType!]: {
            db,
            accession,
          },
        }),
    });
  },
);

export default loadData({
  getUrl: mapStateToUrl,
  mapStateToProps,
} as LoadDataParameters)(EntryMenuWithoutData);
