import React, { FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';
import style from 'components/FiltersPanel/style.css';

const css = cssBinder(style);

type Props = {
  label?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};
interface LoadedProps extends Props, LoadDataProps<GroupByPayload> {}

const FragmentFilter = ({
  data,
  isStale,
  customLocation,
  goToCustomLocation,
}: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;

  const groupsPayload = getPayloadOrEmpty(
    payload?.is_fragment,
    loading,
    isStale,
  );
  const names = new Map([
    ['true', 'Fragment'],
    ['false', 'Complete Sequence'],
    ['both', 'Both/All'],
  ]);
  const groups: Record<string, number> = {
    true: groupsPayload.true || 0,
    false: groupsPayload.false || 0,
  };
  if (!loading) {
    groups.both = groups ? (groups.true || 0) + (groups.false || 0) : 0;
  }
  const currentValue = (
    (customLocation?.search.is_fragment as string) || 'both'
  ).toLowerCase();
  const _handleSelection = ({ target }: FormEvent) => {
    if (!customLocation) return;
    const value = (target as HTMLInputElement).value;
    const { page, cursor, ...search } = customLocation.search || {};
    const _search: InterProLocationSearch = { ...search, is_fragment: value };
    if (value === 'both') {
      delete _search.is_fragment;
    }
    goToCustomLocation?.({
      ...customLocation,
      description: {
        ...customLocation.description,
      },
      search: _search,
    });
  };
  return (
    <div className={css('list-curation', { stale: isStale })}>
      <div>
        {Object.entries(groups)
          .sort(([x], [y]) => {
            if (x === 'both') return -1;
            if (y === 'both') return 1;
            return x > y ? 1 : -1;
          })
          .map(([isFragment, value]) => (
            <label
              key={isFragment}
              className={css('radio-btn-label', {
                checked: currentValue === isFragment,
              })}
            >
              <input
                type="radio"
                name="fragment_filter"
                className={css('radio-btn')}
                value={isFragment}
                disabled={isStale}
                onChange={_handleSelection}
                checked={currentValue === isFragment}
                style={{ margin: '0.25em' }}
              />
              <span>{names.get(isFragment)}</span>
              <NumberComponent
                label
                loading={loading}
                className={css('filter-label')}
                abbr
              >
                {value}
              </NumberComponent>
            </label>
          ))}
      </div>
    </div>
  );
};

const getUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    const _description: InterProPartialDescription = {
      ...description,
      protein: { db: description.protein.db || 'UniProt' },
    };
    // For Subpages
    if (description.main.key !== 'protein') {
      _description.main = { key: 'protein' };
      _description[description.main.key as Endpoint] = {
        ...description[description.main.key],
        isFilter: true,
      };
    }

    // omit from search
    const { search: _, cursor: __, ..._search } = search;
    if ('is_fragment' in _search) delete _search.is_fragment;
    // add to search
    _search.group_by = 'is_fragment';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(FragmentFilter);
