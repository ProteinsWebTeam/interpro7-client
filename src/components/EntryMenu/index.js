import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import EntryMenuLink from './EntryMenuLink';
import Loading from 'components/SimpleCommonComponents/Loading';
import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import AlphaFoldMenuLink from './EntryMenuLink/AlphaFoldMenuLink';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';

import entryMenuLinkClasses from './EntryMenuLink/style.css';

const f = foundationPartial(styles, fonts);

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

/*:: type Props = {
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  isSignature: boolean,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  children: ?any,
  className: ?string,
  lowGraphics: boolean,
  usedOnTheSide?: boolean,
  width?: number,
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
    lowGraphics: T.bool.isRequired,
    usedOnTheSide: T.bool,
    width: T.number,
  };

  constructor(props /*: Props */) {
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

  componentDidUpdate(_, prevState) {
    const DELAY = 300;
    if (this.state.isCollapsed === prevState.isCollapsed) {
      this._moveFakeBorder();
    } else {
      setTimeout(() => this._moveFakeBorder(), DELAY);
    }
  }

  componentWillUnmount() {
    if (this._animation) this._animation.cancel();
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
      data: { loading, payload },
      className,
      usedOnTheSide,
    } = this.props;
    let tabs = entities;
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
    const alphafold = singleEntity.get('alphafold');
    return (
      <ul
        className={f('tabs', className, {
          sign: isSignature,
          onside: usedOnTheSide,
          collapsed: this.state.isCollapsed,
        })}
        ref={this._ref}
        data-testid="menu"
      >
        {!usedOnTheSide && (
          <nav className={f('collapse-bar')}>
            <button
              className={f('icon', 'icon-common', 'icon-backward')}
              onClick={() =>
                this.setState({ isCollapsed: !this.state.isCollapsed })
              }
            />
          </nav>
        )}
        <span
          data-testid="entry-menu"
          className={f(
            'fake-border',
            payload.metadata.source_database.toLowerCase() === 'interpro'
              ? mapNameToClass.get(payload.metadata.type)
              : null,
            { ['is-signature']: isSignature },
          )}
          style={{
            top: this.state?.topBorder || 0,
          }}
        />
        {children}
        {tabs.map((e) => (
          <EntryMenuLink
            key={e.name}
            metadata={payload.metadata}
            to={e.to}
            exact={e.exact}
            activeClass={e.activeClass}
            name={e.name}
            data={data}
            counter={e.counter}
            isFirstLevel={!mainAccession}
            usedOnTheSide={usedOnTheSide}
            collapsed={this.state.isCollapsed}
          />
        ))}
        {mainType === 'protein' && alphafold && (
          <AlphaFoldMenuLink
            to={alphafold.to}
            exact={alphafold.exact}
            name={alphafold.name}
            usedOnTheSide={usedOnTheSide}
            collapsed={this.state.isCollapsed}
          />
        )}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .detail,
  (state) =>
    Object.entries(state.customLocation.description)
      .filter(([_, { isFilter }]) => isFilter)
      .map(([f]) => f),

  (state) => state.settings.ui.lowGraphics,
  (mainType, mainDB, mainAccession, mainDetail, filters, lowGraphics) => ({
    mainType,
    mainDB,
    mainAccession,
    mainDetail,
    filters,
    isSignature: !!(
      mainType === 'entry' &&
      mainDB !== 'InterPro' &&
      mainAccession
    ),
    lowGraphics,
  }),
);

const mapStateToUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
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
          [mainType]: {
            db,
            accession,
          },
        }),
    });
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  EntryMenuWithoutData,
);
