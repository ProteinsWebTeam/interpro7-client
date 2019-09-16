/* eslint-disable no-param-reassign */
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
import { formatExperimentType } from 'components/Structure/utils';

const f = foundationPartial(style);

/* :: type Props = {
  data: {
    loading: boolean,
    payload: Object,
    },
  goToCustomLocation: function,
  customLocation: {
    search: Object,
  }
}
*/

class ExperimentTypeFilter extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const {
      page,
      cursor,
      experiment_type: _,
      ...search
    } = this.props.customLocation.search;
    if (value !== 'All') search.experiment_type = value;
    if (value === 'nmr' && search.resolution) delete search.resolution;
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { search },
    } = this.props;
    const defaultObject = { 'x-ray': NaN, nmr: NaN };
    const types = Object.entries(
      loading ? defaultObject : { ...defaultObject, ...payload },
    ).sort(([, a], [, b]) => b - a);
    if (!loading) {
      types.unshift(['All', NaN]);
    }
    return (
      <div style={{ overflowX: 'hidden' }} className={f('list-experiment')}>
        {types.map(([type, count]) => (
          <div key={type} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="experiment_type"
                value={type}
                onChange={this._handleSelection}
                checked={
                  (!search.experiment_type && type === 'All') ||
                  search.experiment_type === type
                }
                style={{ margin: '0.25em' }}
              />
              <span>{formatExperimentType(type)}</span>
              {typeof count === 'undefined' || isNaN(count) ? null : (
                <NumberComponent
                  label
                  loading={loading}
                  className={f('filter-label')}
                  abbr
                >
                  {count}
                </NumberComponent>
              )}
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
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    // eslint-disable-next-line camelcase
    const { experiment_type, search: _, cursor, ..._search } = search;
    // add to search
    _search.group_by = 'experiment_type';
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
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(ExperimentTypeFilter);
