import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import { goToCustomLocation } from 'actions/creators';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import NumberComponent from 'components/NumberComponent';

import cssBinder from 'styles/cssBinder';

import style from 'components/FiltersPanel/style.css';

const css = cssBinder(style);

type Props = {
  label?: string;
  latest?: boolean;
  customLocation?: InterProLocation;
  goToCustomLocation?: typeof goToCustomLocation;
};
interface LoadedProps extends Props, LoadDataProps<PayloadList<unknown>> {}

const LatestFilter = ({
  data,
  isStale,
  latest,
  customLocation,
  goToCustomLocation,
}: LoadedProps) => {
  if (!data) return null;
  if (!data.payload || !customLocation) return null;
  const handleChange = () => {
    const { page, ...search } = customLocation.search;
    const { latest_entries, ...rest } = search;
    if (!latest) rest.latest_entries = '';
    goToCustomLocation?.({
      ...customLocation,
      search: rest,
    });
  };
  return (
    <div className={css('vf-stack', 'vf-stack--200', 'filter')}>
      <label className={css('radio-btn-label', { checked: !latest })}>
        <input
          type="radio"
          name="latest_all"
          className={css('radio-btn')}
          value={'All'}
          disabled={isStale}
          onChange={handleChange}
          checked={!latest}
          style={{ margin: '0.25em' }}
        />
        <span>All</span>
      </label>
      <label className={css('radio-btn-label', { checked: latest })}>
        <input
          type="radio"
          name="latest_on"
          className={css('radio-btn')}
          value={'latest'}
          disabled={isStale}
          onChange={handleChange}
          checked={latest}
          style={{ margin: '0.25em' }}
        />
        <span>New Entries</span>
        <NumberComponent
          label
          loading={data.loading}
          className={css('filter-label')}
          abbr
        >
          {data.payload.count}
        </NumberComponent>
      </label>
    </div>
  );
};

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { search: _, cursor: __, ..._search } = search;
    // add to search
    _search.latest_entries = '';
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
  (customLocation) => ({
    customLocation,
    latest: 'latest_entries' in customLocation.search,
  }),
);

export default loadData<PayloadList<unknown>>({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(LatestFilter);
