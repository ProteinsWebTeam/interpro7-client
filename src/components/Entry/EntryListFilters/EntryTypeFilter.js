// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const allRE = /^all$/i;
const isAll = (string) => allRE.test(string);

/* :: type Props = {
  data: {
    loading: boolean,
    payload: any,
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    description: {
      entry: {
        db: string,
      }
    },
    search: Object,
  }
}; */

class EntryTypeFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.shape({
        entry: T.shape({
          db: T.string.isRequired,
        }).isRequired,
      }).isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  _handleSelection = ({ target: { value } }) => {
    const { page, type, ...search } = this.props.customLocation.search;
    if (!isAll(value)) search.type = value;
    delete search.cursor;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  _formatType = (type) => {
    if (type === 'ptm') return 'PTM';
    else if (type === 'unknown') return 'Other';
    return type.replace('_', ' ');
  };

  render() {
    const {
      data: { loading, payload },
      isStale,
      customLocation: {
        description: {
          entry: { db },
        },
        search,
      },
    } = this.props;

    // prettier-ignore
    const types = (Object.entries(
      getPayloadOrEmpty(payload, loading, isStale),
    ) /*: any */)
      .sort(([aType], [bType]) => {
        const typeOrder = [
          'family',
          'domain',
          'homologous_superfamily',
          'repeat',
          'conserved_site',
          'active_site',
          'binding_site',
          'ptm'
        ];
        const i = typeOrder.indexOf(aType.toLowerCase());
        const j = typeOrder.indexOf(bType.toLowerCase());
        if (i === -1 && j === -1)
          return aType.localeCompare(bType); // both types unknown
        else if (i === -1)
          return 1; // aType unknown: place after bType
        return i - j; // both types known: use predefined order
      });
    if (!loading) {
      types.unshift(['All', types.reduce((acc, [, count]) => acc + count, 0)]);
    }
    return (
      <div className={f('list-entries', { stale: isStale })}>
        <div className={f('column')}>
          {types.map(([type, count]) => {
            const checked =
              (!search.type && isAll(type)) ||
              search.type === type.toLowerCase();
            return (
              <label key={type} className={f('radio-btn-label', { checked })}>
                <input
                  type="radio"
                  name="entry_type"
                  className={f('radio-btn')}
                  value={type.toLowerCase()}
                  onChange={this._handleSelection}
                  disabled={isStale}
                  checked={checked}
                  style={{ margin: '0.25em' }}
                />
                <span>
                  {isAll(type) || db !== 'InterPro' ? (
                    this._formatType(type)
                  ) : (
                    <interpro-type
                      type={type.replace('_', ' ')}
                      expanded
                      dimension="17px"
                    >
                      {type}
                    </interpro-type>
                  )}
                </span>
                <NumberComponent
                  label
                  loading={loading}
                  className={f('filter-label')}
                  abbr
                >
                  {count}
                </NumberComponent>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, cursor: __, ..._search } = search;
    // add to search
    _search.group_by = 'type';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(EntryTypeFilter);
