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

const CurationFilter = ({
  data,
  isStale,
  goToCustomLocation,
  customLocation,
}: LoadedProps) => {
  if (!data || !customLocation) return null;
  const { loading, payload } = data;
  const databases = {
    uniprot: 0,
    reviewed: 0,
    unreviewed: 0,
    ...getPayloadOrEmpty(payload, loading, isStale),
  };
  if (!loading) databases.uniprot = databases.reviewed + databases.unreviewed;
  const description = customLocation.description;
  const _handleSelection = ({ target }: FormEvent) => {
    const value = (target as HTMLInputElement).value;

    const { page, cursor, ...search } = customLocation.search;
    goToCustomLocation?.({
      ...customLocation,
      description: {
        ...customLocation.description,
        protein: {
          ...customLocation.description.protein,
          db: value,
        },
      },
      search,
    });
  };
  return (
    <div className={css('list-curation', 'filter', { stale: isStale })}>
      <div>
        {Object.entries(databases)
          .sort(([x], [y]) => {
            if (x === 'uniprot') return -1;
            if (y === 'uniprot') return 1;
            return x > y ? 1 : -1;
          })
          .map(([db, value]) => {
            const checked = (description.protein.db || '').toLowerCase() === db;
            return (
              <label key={db} className={css('radio-btn-label', { checked })}>
                <input
                  type="radio"
                  name="curated_filter"
                  className={css('radio-btn')}
                  value={db}
                  disabled={isStale || value === 0}
                  onChange={_handleSelection}
                  checked={checked}
                  style={{ margin: '0.25em' }}
                />
                <span>{db === 'uniprot' ? 'all' : db}</span>
                <NumberComponent
                  label
                  loading={loading}
                  className={css('filter-label')}
                  abbr
                >
                  {value}
                </NumberComponent>
              </label>
            );
          })}
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
      protein: { db: 'UniProt' },
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
    // add to search
    _search.group_by = 'source_database';
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
} as LoadDataParameters)(CurationFilter);
