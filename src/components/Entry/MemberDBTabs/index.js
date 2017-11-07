/* eslint-disable jsx-a11y/no-onchange */
import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import AnimatedEntry from 'components/AnimatedEntry';
import NumberLabel from 'components/NumberLabel';
import Link from 'components/generic/Link';
import { createSelector } from 'reselect';

import { goToNewLocation } from 'actions/creators';

import loadData from 'higherOrder/loadData';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import styles from './style.css';

const f = foundationPartial(styles);

const colors = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6',
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#dfafdf',
  prints: '#54c75f',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff7a76',
  ssf: '#686868',
  tigrfams: '#56b9a6',
  InterPro: '#2daec1',
};

class MemberDBTab extends PureComponent {
  static propTypes = {
    newTo: T.oneOfType([T.object, T.func]).isRequired,
    children: T.string.isRequired,
    value: T.number.isRequired,
    mainType: T.string.isRequired,
  };

  render() {
    const { newTo, children, value, mainType } = this.props;
    return (
      <li className={f('tabs-title')}>
        <Link
          newTo={newTo}
          activeClass={f('is-active', 'is-active-tab', [children])}
          style={{ color: colors[children] ? colors[children] : null }}
        >
          <span className={f('db-label')}>{children}&nbsp;</span>
          <NumberLabel
            value={value}
            className={f('number-label')}
            title={`${value} ${value > 1
              ? toPlural(mainType)
              : mainType} found`}
          />
        </Link>
      </li>
    );
  }
}

class MemberDBTabSlim extends PureComponent {
  static propTypes = {
    newTo: T.oneOfType([T.object, T.func]).isRequired,
    children: T.string.isRequired,
    value: T.number.isRequired,
    mainType: T.string.isRequired,
  };

  render() {
    const { children, value, mainType } = this.props;
    const type = mainType;
    const plural = toPlural(type);
    return (
      <option value={children}>
        {children} ({value} {plural})
      </option>
    );
  }
}
const entryIsMain = ({ description: { mainType } }) => mainType === 'entry';
const mainOrFocus = location => (entryIsMain(location) ? 'main' : 'focus');
const getValueFor = ({ entries }, mainType, db) => {
  let extract;
  if (db === 'interpro') {
    extract = entries.interpro;
  } else {
    extract = entries.member_databases[db];
  }
  if (mainType === 'entry') return extract;
  return extract[toPlural(mainType)];
};

let tabs;

class MemberDBTabs extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }),
    mainType: T.string,
    goToNewLocation: T.func.isRequired,
    newLocation: T.object.isRequired,
    lowGraphics: T.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  _handleExpansion = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  _handleChange = e => {
    const description = { ...this.props.newLocation.description };
    if (description.mainType === 'entry') {
      description.mainDB = e.target.value;
    } else {
      description.focusType = 'entry';
      description.focusDB = e.target.value;
    }
    this.props.goToNewLocation({
      ...this.props.newLocation,
      description,
    });
  };

  render() {
    const { data: { loading, payload }, mainType, lowGraphics } = this.props;
    const { collapsed } = this.state;
    if (!loading) {
      tabs = [
        {
          name: 'InterPro',
          newTo(location) {
            return {
              ...location,
              description: {
                ...location.description,
                [`${mainOrFocus(location)}Type`]: 'entry',
                [`${mainOrFocus(location)}DB`]: 'InterPro',
                mainIntegration: null,
              },
            };
          },
          value: getValueFor(payload, mainType, 'interpro'),
        },
        ...Object.keys(payload.entries.member_databases)
          .filter(k => k !== 'mobidblt')
          .sort()
          .map(e => ({
            name: e,
            newTo(location) {
              return {
                ...location,
                description: {
                  ...location.description,
                  [`${mainOrFocus(location)}Type`]: 'entry',
                  [`${mainOrFocus(location)}DB`]: e,
                },
                search: {
                  ...location.search,
                  signature_in: undefined,
                },
              };
            },
            value: getValueFor(payload, mainType, e),
          })),
      ];
    }
    return (
      <div
        className={f('columns', 'small-12', 'medium-3', 'large-2', {
          lowGraphics,
          collapsed,
        })}
      >
        <button
          onClick={this._handleExpansion}
          className={f(
            'expand-button',
            'large',
            'hollow',
            'float-right',
            'hide-for-small-only',
            'light',
            'button',
          )}
        >
          {collapsed ? '»' : '«'}
        </button>

        {tabs && (
          <div
            className={f('browsemd-panel', 'show-for-small-only', {
              collapsed,
            })}
          >
            <span>Which database to browse?</span>
            <select
              value={
                this.props.newLocation.description.mainType === 'entry'
                  ? this.props.newLocation.description.mainDB
                  : this.props.newLocation.description.focusDB
              }
              onChange={this._handleChange}
            >
              {tabs.map(e => (
                <MemberDBTabSlim key={e.name} {...e} mainType={mainType}>
                  {e.name}
                </MemberDBTabSlim>
              ))}
            </select>
          </div>
        )}

        <span className={f('tabs', { collapsed })} />
        {tabs && (
          <AnimatedEntry
            className={f('vertical', 'tabs', 'hide-for-small-only', {
              collapsed,
            })}
          >
            {tabs.map(e => (
              <MemberDBTab key={e.name} {...e} mainType={mainType}>
                {e.name}
              </MemberDBTab>
            ))}
          </AnimatedEntry>
        )}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  state => state.newLocation.description.mainType,
  state => state.settings.ui.lowGraphics,
  (newLocation, mainType, lowGraphics) => ({
    newLocation,
    mainType,
    lowGraphics,
  }),
);

const getMemberDBUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation,
  ({ protocol, hostname, port, root }, location) => {
    let output = `${protocol}//${hostname}:${port}${root}/entry`;
    if (!entryIsMain(location)) {
      output += `/${location.description.mainType}/${location.description
        .mainDB}`;
    }
    return output;
  },
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getMemberDBUrl)(MemberDBTabs),
);
