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

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

/*:: type Props = {
  data: {
    loading: boolean,
    payload: any
  },
  isStale: boolean,
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object
  }
}; */

class CurationFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isStale: T.bool.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, cursor, ...search } = this.props.customLocation.search;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        ...this.props.customLocation.description,
        protein: {
          ...this.props.customLocation.description.protein,
          db: value,
        },
      },
      search,
    });
  };

  render() {
    const {
      data: { loading, payload },
      isStale,
      customLocation: { description },
    } = this.props;
    const databases = {
      uniprot: 0,
      reviewed: 0,
      unreviewed: 0,
      ...getPayloadOrEmpty(payload, loading, isStale),
    };
    if (!loading) databases.uniprot = databases.reviewed + databases.unreviewed;
    return (
      <div className={f('list-curation', { stale: isStale })}>
        <div>
          {Object.entries(databases)
            .sort(([x], [y]) => {
              if (x === 'uniprot') return -1;
              if (y === 'uniprot') return 1;
              return x > y ? 1 : -1;
            })
            .map(([db, value]) => {
              const checked = description.protein.db.toLowerCase() === db;
              return (
                <label key={db} className={f('radio-btn-label', { checked })}>
                  <input
                    type="radio"
                    name="curated_filter"
                    className={f('radio-btn')}
                    value={db}
                    disabled={isStale || value === 0}
                    onChange={this._handleSelection}
                    checked={checked}
                    style={{ margin: '0.25em' }}
                  />
                  <span>{db === 'uniprot' ? 'all' : db}</span>
                  <NumberComponent
                    label
                    loading={loading}
                    className={f('filter-label')}
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
  }
}

const getUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    const _description = {
      ...description,
      protein: { db: 'UniProt' },
    };
    // For Subpages
    if (description.main.key !== 'protein') {
      _description.main = { key: 'protein' };
      _description[description.main.key] = {
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
  customLocationSelector,
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(CurationFilter);
