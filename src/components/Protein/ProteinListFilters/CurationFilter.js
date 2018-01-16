// @flow
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const label = {
  reviewed: 'Reviewed',
  unreviewed: 'Unreviewed',
  uniprot: 'Both',
};

class CurationFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.shape({
        mainDB: T.string,
      }).isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  constructor() {
    super();
    this.state = { value: null };
  }

  componentWillMount() {
    this.locationToState(this.props.customLocation);
  }

  componentWillReceiveProps(nextProps) {
    this.locationToState(nextProps.customLocation);
  }

  locationToState(customLocation) {
    const db =
      customLocation.description[customLocation.description.main.key].db;
    if (db === 'reviewed') {
      this.setState({ value: 'reviewed' });
    } else if (db === 'unreviewed') {
      this.setState({ value: 'unreviewed' });
    } else {
      this.setState({ value: 'uniprot' });
    }
  }

  _handleSelection = ({ target: { value } }) => {
    this.setState({ value });
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        ...this.props.customLocation.description,
        protein: { db: value },
      },
      search: {
        ...this.props.customLocation.search,
        page: undefined,
      },
    });
  };

  render() {
    const { data: { loading, payload } } = this.props;
    const databases = loading || !payload ? {} : payload;
    if (!loading) {
      databases.uniprot = databases
        ? (databases.reviewed || 0) + (databases.unreviewed || 0)
        : 0;
    }
    return (
      <div>
        {Object.keys(databases)
          .sort()
          .map(db => (
            <div key={db} className={f('column')}>
              <label className={f('row', 'filter-button')}>
                <input
                  type="radio"
                  name="curated_filter"
                  value={db}
                  onChange={this._handleSelection}
                  checked={this.state.value === db}
                  style={{ margin: '0.25em' }}
                />
                <span>{label[db]}</span>
                <NumberLabel
                  value={databases[db]}
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
    return `${protocol}//${hostname}:${port}${root}${descriptionToPath(
      _description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData(getUrl)(CurationFilter),
);
