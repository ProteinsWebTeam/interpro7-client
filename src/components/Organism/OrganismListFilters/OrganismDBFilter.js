import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import NumberComponent from 'components/NumberComponent';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';
import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

class OrganismDBFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
      description: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { page, ...search } = this.props.customLocation.search;
    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        ...this.props.customLocation.description,
        organism: { db: value },
      },
      search,
    });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { description },
    } = this.props;
    const dbs = [];
    let currentDB = '';
    if (!loading) {
      currentDB = description.organism.proteomeDB || description.organism.db;
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
      <div style={{ overflowX: 'hidden' }} className={f('list-organism-type')}>
        {dbs.map(([type, count]) => (
          <div key={type} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="organism_db"
                value={type}
                onChange={this._handleSelection}
                checked={currentDB === type}
                style={{ margin: '0.25em' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
              <NumberComponent
                label
                value={count}
                loading={loading}
                className={f('filter-label')}
                abbr
              />
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) =>
    `${protocol}//${hostname}:${port}${root}${descriptionToPath({
      ...description,
      organism: {},
      main: { key: 'organism' },
    })}`,
);

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(OrganismDBFilter);
