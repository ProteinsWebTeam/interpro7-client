import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { goToNewLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class OrganismDBFilter extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
    location: T.shape({
      description: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    this.props.goToNewLocation({
      ...this.props.location,
      description: {
        ...this.props.location.description,
        mainDB: value,
      },
    });
  };
  render() {
    const {
      data: { loading, payload },
      location: { description },
    } = this.props;
    const dbs = [];
    if (!loading) {
      dbs.push([
        'taxonomy',
        payload.organisms.taxonomy.organisms || payload.organisms.taxonomy,
      ]);
      dbs.push([
        'proteome',
        payload.organisms.proteome.organisms || payload.organisms.proteome,
      ]);
    }
    return (
      <div style={{ overflowX: 'hidden' }}>
        {dbs.map(([type, count]) => (
          <div key={type} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="organism_db"
                value={type}
                onChange={this._handleSelection}
                checked={description.mainDB === type}
                style={{ margin: '0.25em' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
              <NumberLabel value={count} />
            </label>
          </div>
        ))}
      </div>
    );
  }
}
const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { experiment_type, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'experiment_type';
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path({
      mainType: 'organism',
      focusType: description.focusType,
      focusDB: description.focusDB,
    })}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

export default connect(mapStateToProps, { goToNewLocation })(
  loadData(getUrlFor)(OrganismDBFilter),
);
