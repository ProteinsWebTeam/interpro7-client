// @flow
/* eslint-disable jsx-a11y/no-onchange */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MemberDBTab from './MemberDBTab';

import { goToNewLocation } from 'actions/creators';

import loadData from 'higherOrder/loadData';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const menuOptions = new Map([
  ['All', 'all'],
  ['InterPro', 'InterPro'],
  ['CDD', 'cdd'],
  ['Gene3D', 'gene3d'],
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

const getValueFor = ({ entries }, mainType, db) => {
  let extract;
  switch (db) {
    case 'InterPro':
      extract = entries.interpro;
      break;
    case 'all':
      extract = entries.all;
      break;
    default:
      extract = entries.member_databases[db] || null;
  }
  if (mainType === 'entry') return extract;
  return (extract || {})[toPlural(mainType)] || null;
};

/* type Props = {
  data: {
    loading: boolean,
    payload?: Object,
  },
  newLocation: {
    description: {
      mainType: string,
      mainDB: string,
      focusDB: ?string,
    },
    search: Object,
  },
  lowGraphics: boolean,
  goToNewLocation: function,
}; */

class MemberDBTabs extends PureComponent /*:: <Props> */ {
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
      search: T.object,
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
        ...this.props.newLocation.search,
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
                lowGraphics={lowGraphics}
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
      output += `/${location.description.mainType}/${
        location.description.mainDB
      }`;
    }
    return output;
  },
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getMemberDBUrl)(MemberDBTabs),
);
