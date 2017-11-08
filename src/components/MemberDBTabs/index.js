/* eslint-disable jsx-a11y/no-onchange */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NumberLabel from 'components/NumberLabel';
import Link from 'components/generic/Link';
import { goToNewLocation } from 'actions/creators';

import loadData from 'higherOrder/loadData';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const colors = new Map([
  ['gene3d', '#a88cc3'],
  ['cdd', '#addc58'],
  ['hamap', '#2cd6d6'],
  ['panther', '#bfac92'],
  ['pfam', '#6287b1'],
  ['pirsf', '#dfafdf'],
  ['prints', '#54c75f'],
  ['prodom', '#8d99e4'],
  ['profile', '#f69f74'],
  ['prosite', '#f3c766'],
  ['sfld', '#00b1d3'],
  ['smart', '#ff7a76'],
  ['ssf', '#686868'],
  ['tigrfams', '#56b9a6'],
  ['InterPro', '#2daec1'],
]);

const menuOptions = new Map([
  ['All', 'all'],
  ['InterPro', 'InterPro'],
  ['CDD', 'cdd'],
  ['GENE3D', 'gene3d'],
  ['HAMAP', 'hamap'],
  ['PANTHER', 'panther'],
  ['Pfam', 'pfam'],
  ['PIRSF', 'pirsf'],
  ['PRINTS', 'prints'],
  ['PRODOM', 'prodom'],
  ['PROFILE', 'profile'],
  ['PROSITE', 'prosite'],
  ['SFLD', 'sfld'],
  ['SMART', 'smart'],
  ['SSF', 'ssf'],
  ['TIGRFams', 'tigrfams'],
]);

class MemberDBTab extends PureComponent {
  static propTypes = {
    children: T.string.isRequired,
    count: T.number,
    mainType: T.string.isRequired,
    cleanName: T.string.isRequired,
  };

  render() {
    const { children, count, mainType, cleanName } = this.props;
    const newTo = ({ description, restOfLocation }) => {
      const nextLocation = {
        ...restOfLocation,
        description: {
          ...description,
        },
      };
      if (description.mainType === 'entry') {
        nextLocation.description.mainDB = cleanName;
      } else {
        const isNotAll = cleanName !== 'all';
        nextLocation.description.focusType = isNotAll ? 'entry' : null;
        nextLocation.description.focusDB = isNotAll ? cleanName : null;
      }
      return nextLocation;
    };
    return (
      <li className={f('tabs-title')}>
        <Link
          newTo={newTo}
          activeClass={f('is-active', 'is-active-tab')}
          style={{ color: colors.get(cleanName) }}
        >
          <span className={f('db-label')}>{children}&nbsp;</span>
          <NumberLabel
            value={count}
            className={f('number-label')}
            title={
              count !== null && `${count} ${toPlural(mainType, count)} found`
            }
          />
        </Link>
      </li>
    );
  }
}

const getValueFor = ({ entries }, mainType, db) => {
  let extract;
  if (db === 'InterPro') {
    extract = entries.interpro;
  } else {
    extract = entries.member_databases[db] || null;
  }
  if (mainType === 'entry') return extract;
  return (extract || {})[toPlural(mainType)] || null;
};

class MemberDBTabs2 extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    newLocation: T.shape({
      description: T.shape({
        mainType: T.string.isRequired,
        mainDB: T.string.isRequired,
        focusDB: T.string,
      }).isRequired,
    }).isRequired,
    lowGraphics: T.bool.isRequired,
    goToNewLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  _handleCollapseToggle = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  _handleChange = ({ target: { value } }) => {
    const description = { ...this.props.newLocation.description };
    if (description.mainType === 'entry') {
      description.mainDB = value;
    } else {
      const isNotAll = value !== 'all';
      description.focusType = isNotAll && 'entry';
      description.focusDB = isNotAll && value;
    }
    this.props.goToNewLocation({
      ...this.props.newLocation,
      description,
      search: {
        ...this.props.search,
        page: null,
      },
    });
  };

  render() {
    const {
      data: { loading, payload },
      newLocation: { description: { mainType, mainDB, focusDB } },
      lowGraphics,
    } = this.props;
    const { collapsed } = this.state;
    const value = mainType === 'entry' ? mainDB : focusDB;
    const options = Array.from(menuOptions).filter(
      ([, value]) => !(mainType === 'entry' && value === 'all'),
    );
    return (
      <div
        className={f('columns', 'small-12', 'medium-3', 'large-2', {
          lowGraphics,
          collapsed,
        })}
      >
        <button
          onClick={this._handleCollapseToggle}
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
        <label className={f('browsemd-panel', 'show-for-small-only')}>
          Select a database to filter these {toPlural(mainType)}:
          <select value={value || 'all'} onChange={this._handleChange}>
            {options.map(([name, value]) => {
              const count = loading
                ? null
                : getValueFor(payload, mainType, value);
              return (
                <option value={value} key={value}>
                  {name}
                  {count === null ? null : ` (${count} ${toPlural(mainType)})`}
                </option>
              );
            })}
          </select>
        </label>
        <span className={f('tabs', { collapsed })} />
        <ul className={f('vertical', 'tabs', 'hide-for-small-only')}>
          {options.map(([name, value]) => {
            const count = loading
              ? null
              : getValueFor(payload, mainType, value);
            return (
              <MemberDBTab
                key={name}
                mainType={mainType}
                count={count}
                cleanName={value}
              >
                {name}
              </MemberDBTab>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  state => state.settings.ui.lowGraphics,
  (newLocation, lowGraphics) => ({ newLocation, lowGraphics }),
);

const getMemberDBUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation,
  ({ protocol, hostname, port, root }, location) => {
    let output = `${protocol}//${hostname}:${port}${root}/entry`;
    if (location.description.mainType !== 'entry') {
      output += `/${location.description.mainType}/${location.description
        .mainDB}`;
    }
    return output;
  },
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getMemberDBUrl)(MemberDBTabs2),
);
