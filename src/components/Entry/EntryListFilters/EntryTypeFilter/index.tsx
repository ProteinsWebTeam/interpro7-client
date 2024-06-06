import React, { FormEvent, PureComponent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import loadWebComponent from 'utils/load-web-component';

import cssBinder from 'styles/cssBinder';

import style from 'components/FiltersPanel/style.css';

const css = cssBinder(style);

const allRE = /^all$/i;
const isAll = (string: string) => allRE.test(string);

type Props = {
  goToCustomLocation: typeof goToCustomLocation;
  customLocation: InterProLocation;
};

interface LoadedProps extends Props, LoadDataProps<GroupByPayload> {}

class EntryTypeFilter extends PureComponent<LoadedProps> {
  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    const { page, type, ...search } = this.props.customLocation.search;
    if (!isAll(value)) search.type = value;
    delete search.cursor;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  _formatType = (type: string) => {
    if (type === 'ptm') return 'PTM';
    else if (type === 'unknown') return 'Other';
    return type.replace('_', ' ');
  };

  render() {
    if (!this.props.data) return null;
    const {
      data: { loading, payload },
      isStale,
      customLocation: {
        description: { entry },
        search,
      },
    } = this.props;
    const db = (entry as EndpointLocation)?.db;

    const types = Object.entries<number>(
      getPayloadOrEmpty(payload, loading, isStale),
    ).sort(([aType], [bType]) => {
      const typeOrder = [
        'family',
        'domain',
        'homologous_superfamily',
        'repeat',
        'conserved_site',
        'active_site',
        'binding_site',
        'ptm',
      ];
      const i = typeOrder.indexOf(aType.toLowerCase());
      const j = typeOrder.indexOf(bType.toLowerCase());
      if (i === -1 && j === -1)
        return aType.localeCompare(bType); // both types unknown
      else if (i === -1) return 1; // aType unknown: place after bType
      return i - j; // both types known: use predefined order
    });
    if (!loading) {
      types.unshift(['All', types.reduce((acc, [, count]) => acc + count, 0)]);
    }
    return (
      <div className={css('list-entries', 'filter', { stale: isStale })}>
        {types.map(([type, count]) => {
          const checked =
            (!search.type && isAll(type)) || search.type === type.toLowerCase();
          return (
            <label key={type} className={css('radio-btn-label', { checked })}>
              <input
                type="radio"
                name="entry_type"
                className={css('radio-btn')}
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
                className={css('filter-label')}
                abbr
              >
                {count}
              </NumberComponent>
            </label>
          );
        })}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
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
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default loadData<GroupByPayload>({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(EntryTypeFilter);
