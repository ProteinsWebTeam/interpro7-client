import React, { FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';
import style from 'components/FiltersPanel/style.css';

const css = cssBinder(style);

const labels = new Map([
  ['both', 'All'],
  ['true', 'With Matches'],
  ['false', 'Without Matches'],
]);

type Props = {
  label?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};

interface LoadedProps extends Props, LoadDataProps<GroupByPayload> {}

const MatchPresenceFilter = ({
  data,
  isStale,
  goToCustomLocation,
  customLocation,
}: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { loading, payload } = data;
  const { search } = customLocation;

  const hasMatches = new Map(
    Object.entries(
      getPayloadOrEmpty(payload?.match_presence, loading, isStale),
    ),
  );

  if (!loading) {
    let totalCount = 0;
    hasMatches.forEach((value) => {
      if (typeof value === 'number') totalCount += value;
    });
    hasMatches.set('both', totalCount);
  }
  const selectedValue = search.match_presence || 'both';

  const _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    const {
      page,
      match_presence: _,
      cursor,
      ...search
    } = customLocation.search;
    if (labels.has(value) && value.toLowerCase() !== 'both')
      search.match_presence = value;
    goToCustomLocation?.({ ...customLocation, search });
  };

  return (
    <div className={css('list-match-presence', 'filter', { stale: isStale })}>
      {[...labels.entries()].map(([key, label]) => {
        const checked = key === selectedValue;
        return (
          <div key={key}>
            <label className={css('radio-btn-label', { checked })}>
              <input
                type="radio"
                name="match_presence_filter"
                className={css('radio-btn')}
                value={key}
                disabled={isStale}
                checked={checked}
                onChange={_handleSelection}
                style={{ margin: '0.25em' }}
              />
              <span>{label}</span>
              <NumberComponent
                label
                loading={loading}
                className={css('filter-label')}
                abbr
              >
                {hasMatches.get(key) || 0}
              </NumberComponent>
            </label>
          </div>
        );
      })}
    </div>
  );
};

const getUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    const _description = {
      ...description,
      protein: { db: description.protein.db || 'UniProt' },
    };
    // omit from search
    const { search: _, match_presence: __, cursor, ..._search } = search;
    // add to search
    _search.group_by = 'match_presence';
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
} as LoadDataParameters)(MatchPresenceFilter);
