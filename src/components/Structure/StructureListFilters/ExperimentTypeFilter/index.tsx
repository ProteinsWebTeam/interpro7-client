import React, { FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import { getPayloadOrEmpty } from 'components/FiltersPanel';
import { formatExperimentType } from 'components/Structure/utils';

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

const ExperimentTypeFilter = ({
  data,
  isStale,
  customLocation,
  goToCustomLocation,
}: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { loading, payload } = data;
  const search = customLocation.search;
  const defaultObject = { 'x-ray': NaN, nmr: NaN, em: NaN };
  const _payload = getPayloadOrEmpty(
    { ...defaultObject, ...payload },
    loading,
    isStale,
  );
  const types = Object.entries(_payload)
    .filter(([_, v]) => !!v)
    .sort(([, a], [, b]) => b - a);
  if (!loading) {
    types.unshift(['All', NaN]);
  }
  const _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    const {
      page,
      cursor,
      experiment_type: _,
      ...search
    } = customLocation.search;
    if (value !== 'All') search.experiment_type = value;
    if (value === 'nmr' && search.resolution) delete search.resolution;
    goToCustomLocation?.({ ...customLocation, search });
  };
  return (
    <div
      style={{ overflowX: 'hidden' }}
      className={css('list-experiment', { stale: isStale })}
    >
      <div className={css('filter')}>
        {types.map(([type, count]) => {
          const checked =
            (!search.experiment_type && type === 'All') ||
            search.experiment_type === type;
          return (
            <label key={type} className={css('radio-btn-label', { checked })}>
              <input
                type="radio"
                name="experiment_type"
                className={css('radio-btn')}
                value={type}
                disabled={isStale}
                onChange={_handleSelection}
                checked={checked}
                style={{ margin: '0.25em' }}
              />
              <span>{formatExperimentType(type)}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberComponent
                  label
                  loading={loading}
                  className={css('filter-label')}
                  abbr
                >
                  {count}
                </NumberComponent>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    // eslint-disable-next-line camelcase
    const { experiment_type, search: _, cursor, ..._search } = search;
    // add to search
    _search.group_by = 'experiment_type';
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

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(ExperimentTypeFilter);
