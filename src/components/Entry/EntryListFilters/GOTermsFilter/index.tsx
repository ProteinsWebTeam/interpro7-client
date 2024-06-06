import React, { FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { getPayloadOrEmpty } from 'components/FiltersPanel';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import style from 'components/FiltersPanel/style.css';
import stylego from 'pages/style.css';

const css = cssBinder(stylego, style);

const categories = {
  'Biological Process': 'P',
  'Cellular Component': 'C',
  'Molecular Function': 'F',
};
type Categories = keyof typeof categories;

const short = {
  'Biological Process': 'BP',
  'Cellular Component': 'CC',
  'Molecular Function': 'MF',
};

type Props = {
  label?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};

interface LoadedProps extends Props, LoadDataProps<GroupByPayload> {}

const GOTermsFilter = ({
  data,
  isStale,
  customLocation,
  goToCustomLocation,
}: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { loading, payload } = data;
  const { search } = customLocation;

  const _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;
    const { page, go_category: _, cursor: __, ...restOfsearch } = search;
    if (value !== 'All') restOfsearch.go_category = value;
    goToCustomLocation?.({ ...customLocation, search: restOfsearch });
  };

  const terms = Object.entries<number>(
    getPayloadOrEmpty(payload, loading, isStale),
  ).sort(([, a], [, b]) => b - a);

  if (!loading) {
    terms.unshift(['All', NaN]);
  }
  return (
    <div className={css('list-go', { stale: isStale })}>
      <div className={css('filter')}>
        {terms.map(([t, count]) => {
          const term = t as Categories | 'All';
          const checked =
            (term === 'All' && !search.go_category) ||
            search.go_category === categories[term as Categories];
          return (
            <label key={term} className={css('radio-btn-label', { checked })}>
              <input
                type="radio"
                name="go_category"
                className={css('radio-btn')}
                value={categories[term as Categories] || 'All'}
                disabled={isStale}
                onChange={_handleSelection}
                checked={checked}
                style={{ margin: '0.25em' }}
              />
              <span>{term}</span>

              {term in short && (
                <Tooltip title={`${term} category`}>
                  <small
                    className={css(
                      'go-short-label',
                      'sign-label-head',
                      short[term as Categories].toLowerCase(),
                    )}
                  >
                    {short[term as Categories]}
                  </small>
                </Tooltip>
              )}

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
    const {
      // eslint-disable-next-line camelcase
      page_size,
      search: _,
      cursor: __,
      // eslint-disable-next-line camelcase
      go_category,
      ..._search
    } = search;
    // add to search
    _search.group_by = 'go_categories';
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
} as LoadDataParameters)(GOTermsFilter);
