import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberComponent from 'components/NumberComponent';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class CurationFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, ...search } = this.props.customLocation.search;
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
      customLocation: { description },
    } = this.props;
    const databases = loading || !payload ? {} : payload;
    if (!loading) {
      databases.uniprot = databases
        ? (databases.reviewed || 0) + (databases.unreviewed || 0)
        : 0;
    }
    return (
      <div className={f('list-curation')}>
        {Object.entries(databases).map(([db, value]) => (
          <div key={db} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="curated_filter"
                value={db}
                onChange={this._handleSelection}
                checked={description.protein.db.toLowerCase() === db}
                style={{ margin: '0.25em' }}
              />
              <span>{db === 'uniprot' ? 'both' : db}</span>
              <NumberComponent
                label
                loading={loading}
                className={f('filter-label')}
                abbr
              >
                {value}
              </NumberComponent>
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
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
    const { search: _, ..._search } = search;
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
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(CurationFilter);
