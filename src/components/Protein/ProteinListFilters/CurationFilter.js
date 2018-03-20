import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

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
        protein: { db: value },
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
              <NumberLabel
                value={value}
                loading={loading}
                className={f('filter-label')}
              />
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData(getUrl)(CurationFilter),
);
