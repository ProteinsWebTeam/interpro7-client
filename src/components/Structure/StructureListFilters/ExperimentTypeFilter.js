/* eslint-disable no-param-reassign */
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
import { formatExperimentType } from 'components/Structure/utils';

const f = foundationPartial(style);

/* :: type Props = {
  data: {
    loading: boolean,
    payload: Object,
    },
  isStale: boolean,
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
    isStale: T.bool.isRequired,
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
      isStale,
      customLocation: { search },
    } = this.props;
    const defaultObject = { 'x-ray': NaN, nmr: NaN, em: NaN };
    const _payload = getPayloadOrEmpty(
      { ...defaultObject, ...payload },
      loading,
      isStale,
    );
    const types = Object.entries(_payload)
      .filter(([_, v]) => !!v)
      .sort(([, a], [, b]) => b - a);
    if (!loading) {
      types.unshift(['All', NaN]);
    }
    return (
      <div
        style={{ overflowX: 'hidden' }}
        className={f('list-experiment', { stale: isStale })}
      >
        <div className={f('column')}>
          {types.map(([type, count]) => {
            const checked =
              (!search.experiment_type && type === 'All') ||
              search.experiment_type === type;
            return (
              <label key={type} className={f('radio-btn-label', { checked })}>
                <input
                  type="radio"
                  name="experiment_type"
                  className={f('radio-btn')}
                  value={type}
                  disabled={isStale}
                  onChange={this._handleSelection}
                  checked={checked}
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
            );
          })}
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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
  (customLocation) => ({ customLocation }),
);

export default loadData({
  getUrl: getUrlFor,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(ExperimentTypeFilter);
