/* eslint-disable jsx-a11y/no-onchange */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import MemberDBTab from './MemberDBTab';

import { goToCustomLocation } from 'actions/creators';

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
  ['ProDom', 'prodom'],
  ['Prosite-Profile', 'profile'],
  ['Prosite-Patterns', 'prosite'],
  ['SFLD', 'sfld'],
  ['SMART', 'smart'],
  ['Superfamily', 'ssf'],
  ['TIGRFAM', 'tigrfams'],
]);

const defaultDBFor = new Map([
  ['protein', 'uniprot'],
  ['structure', 'pdb'],
  ['organism', 'taxonomy'],
  ['set', 'all'],
]);

const getValueFor = (data, mainType, db) => {
  if (data.loading) return null;
  let extract;
  switch (db) {
    case 'InterPro':
      extract = data.payload.entries.interpro;
      break;
    case 'all':
      extract = data.payload[toPlural(mainType)];
      if (defaultDBFor.has(mainType)) {
        return extract[defaultDBFor.get(mainType)];
      }
      break;
    default:
      extract = data.payload.entries.member_databases[db] || null;
  }
  if (mainType === 'entry') return extract;
  return (extract || {})[toPlural(mainType)] || null;
};

/* type Props = {
  dataDB: {
    loading: boolean,
    payload?: Object,
  },
  dataAll: {
    loading: boolean,
    payload?: Object,
  },
  customLocation: {
    description: {
      main: { key: ?string },
    },
    search: Object,
  },
  lowGraphics: boolean,
  goToCustomLocation: function,
}; */

class MemberDBTabs extends PureComponent /*:: <Props> */ {
  static propTypes = {
    dataDB: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    dataAll: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    lowGraphics: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  _handleCollapseToggle = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  _handleChange = ({ target: { value } }) => {
    const description = { ...this.props.customLocation.description };
    if (description.mainType === 'entry') {
      description.mainDB = value;
    } else {
      const isNotAll = value !== 'all';
      description.focusType = isNotAll && 'entry';
      description.focusDB = isNotAll && value;
    }
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description,
      search: {
        ...this.props.customLocation.search,
        page: null,
      },
    });
  };

  render() {
    const {
      dataDB,
      dataAll,
      customLocation: {
        description: { main: { key: mainType }, entry: { db: value } },
      },
      lowGraphics,
    } = this.props;
    const { collapsed } = this.state;
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
        {collapsed ? (
          <Tooltip title="Expand panel">
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
              aria-label="Expand panel"
            >
              »
            </button>
          </Tooltip>
        ) : (
          <Tooltip title="collapse panel">
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
              aria-label="collapse panel"
            >
              «
            </button>
          </Tooltip>
        )}

        <label className={f('browsemd-panel', 'show-for-small-only')}>
          Select a database to filter these {toPlural(mainType)}:
          <select value={value || 'all'} onChange={this._handleChange}>
            {options.map(([name, value]) => {
              const count = getValueFor(
                value === 'all' ? dataAll : dataDB,
                mainType,
                value,
              );
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
            const count = getValueFor(
              value === 'all' ? dataAll : dataDB,
              mainType,
              value,
            );
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
  state => state.customLocation,
  state => state.settings.ui.lowGraphics,
  (customLocation, lowGraphics) => ({ customLocation, lowGraphics }),
);

const getUrlForMemberDB = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    let output = `${protocol}//${hostname}:${port}${root}/entry`;
    if (description.main.key && description.main.key !== 'entry') {
      output += `/${description.main.key}/${description[description.main.key]
        .proteomeDB || description[description.main.key].db}`;
    }
    return output;
  },
);

const getUrlForAll = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.main.key,
  ({ protocol, hostname, port, root }, mainType) =>
    `${protocol}//${hostname}:${port}${root}/${mainType}`,
);

let exported = MemberDBTabs;
exported = loadData({ getUrl: getUrlForAll, propNamespace: 'All' })(exported);
exported = loadData({ getUrl: getUrlForMemberDB, propNamespace: 'DB' })(
  exported,
);
exported = connect(mapStateToProps, { goToCustomLocation })(exported);

export default exported;
