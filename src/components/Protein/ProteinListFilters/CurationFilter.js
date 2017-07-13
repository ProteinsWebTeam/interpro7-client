import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import f from 'styles/foundation';

const label = {
  swissprot: 'Reviewed',
  trembl: 'Unreviewed',
  uniprot: 'Both',
};

class CurationFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
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
    const { mainDB } = this.props.location.description;
    if (mainDB === 'swissprot') {
      this.setState({ value: 'swissprot' });
    } else if (mainDB === 'trembl') {
      this.setState({ value: 'trembl' });
    } else {
      this.setState({ value: 'uniprot' });
    }
  }

  _handleSelection = ({ target: { value } }) => {
    this.setState({ value });
    this.props.goToNewLocation({
      ...this.props.location,
      description: {
        ...this.props.location.description,
        mainDB: value,
      },
    });
  };

  render() {
    const { data: { loading, payload } } = this.props;
    const databases = loading || !payload ? {} : payload;
    if (!loading) {
      databases.uniprot = databases
        ? (databases.swissprot || 0) + (databases.trembl || 0)
        : 0;
    }
    return (
      <div>
        {Object.keys(databases).sort().map(db =>
          <div key={db} className={f('column')}>
            <label className={f('row', 'align-middle')}>
              <input
                type="radio"
                name="curated_filter"
                value={db}
                onChange={this._handleSelection}
                checked={this.state.value === db}
                style={{ margin: '0.25em' }}
              />
              <span>
                {label[db]}
              </span>
              <NumberLabel value={databases[db]} />
            </label>
          </div>,
        )}
      </div>
    );
  }
}

const getUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    const _description = { ...description, mainDB: 'UniProt' };
    // omit from search
    const { search: _, ..._search } = search;
    // add to search
    _search.group_by = 'source_database';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      _description,
    )}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getUrl)(CurationFilter),
);
