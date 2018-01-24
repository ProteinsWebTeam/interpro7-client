// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import NumberLabel from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

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
                checked={description.organism.db === type}
                style={{ margin: '0.25em' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
              <NumberLabel value={count} className={f('filter-label')} />
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData(getUrlFor)(OrganismDBFilter),
);
