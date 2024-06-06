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

const IntegratedFilter = ({
  data,
  isStale,
  goToCustomLocation,
  customLocation,
}: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { loading, payload } = data;
  let value = customLocation.description.entry.integration || '';
  if (!['unintegrated', 'integrated'].includes(value)) {
    value = 'both';
  }

  const types = getPayloadOrEmpty(payload, loading, isStale);
  if (!loading)
    types.both = (types.integrated || 0) + (types.unintegrated || 0);

  const _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    const { description, search: s, ...rest } = customLocation;
    const { cursor: _, ...search } = s;
    goToCustomLocation?.({
      ...rest,
      search,
      description: {
        ...description,
        entry: {
          ...description.entry,
          integration: value === 'both' ? null : value,
        },
      },
    });
  };
  return (
    <div className={css('list-integrated', 'filter', { stale: isStale })}>
      {Object.keys(types)
        .sort()
        .map((type) => (
          <label
            key={type}
            className={css('radio-btn-label', {
              checked: value === type,
            })}
          >
            <input
              type="radio"
              name="interpro_state"
              value={type}
              className={css('radio-btn')}
              disabled={isStale}
              onChange={_handleSelection}
              checked={value === type}
              style={{ margin: '0.25em' }}
            />
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
            <NumberComponent label loading={loading} abbr>
              {types[type]}
            </NumberComponent>
          </label>
        ))}
    </div>
  );
};

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit integration from description
    const _description = {
      ...description,
      entry: {
        ...description.entry,
        integration: null,
      },
    };
    // omit from search
    const { search: _, cursor: __, ..._search } = search;
    // add to search
    _search.interpro_status = '';
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
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(IntegratedFilter);
