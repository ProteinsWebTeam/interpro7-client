// @flow
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';
import { format } from 'url';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

const DEBOUNCE_RATE = 500; // In ms

const MIN = 0;
const MAX = 20;

const RESOLUTION_RANGE_REGEXP = /^(\d*(\.\d+)?)-(\d*(\.\d+)?)$/;

class ExperimentTypeFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    const [, min = MIN, , max = MAX] =
      (props.customLocation.search.resolution || '').match(
        RESOLUTION_RANGE_REGEXP,
      ) || [];

    this.state = {
      min: Math.min(MAX, Math.max(MIN, +min)),
      max: Math.max(MIN, Math.min(MAX, +max)),
    };
  }

  componentDidMount() {
    // Doing the update location on mount to clamp the values in the URL between
    // MIN and MAX, possibly entered wrongly by the user
    this._updateLocation(true);
    this._updateLocation.flush();
  }

  componentWillUnmount() {
    this._updateLocation.cancel();
  }

  _updateLocation = debounce(fromMount => {
    const { min, max } = this.state;
    const { goToCustomLocation, customLocation } = this.props;
    const { page, resolution: _, ...search } = customLocation.search;
    if (fromMount && page) search.page = page;
    if (min !== MIN || max !== MAX) search.resolution = `${min}-${max}`;
    goToCustomLocation({ ...customLocation, search }, true);
  }, DEBOUNCE_RATE);

  _handleSelection = ({ target: { value } }) => {
    const { page, resolution: _, ...search } = this.props.customLocation.search;
    if (value !== 'All') {
      search.resolution = `${this.state.min}-${this.state.max}`;
    }
    this.props.goToCustomLocation({ ...this.props.customLocation, search });
  };

  _handleChange = ({ target: { name, value } }) =>
    this.setState(
      ({ min, max }) => ({
        [name]:
          name === 'min'
            ? Math.min(max, Math.max(MIN, +value))
            : Math.max(min, Math.min(MAX, +value)),
      }),
      () => {
        if (this.props.customLocation.search.resolution) this._updateLocation();
      },
    );

  render() {
    const { data: { loading }, customLocation: { search } } = this.props;
    if (loading) return null;
    const { min, max } = this.state;
    return (
      <div>
        <label>
          <input
            type="radio"
            name="resolution"
            value="All"
            onChange={this._handleSelection}
            checked={!search.resolution}
            style={{ margin: '0.5em' }}
          />
          <span>All</span>
        </label>
        <label>
          <input
            type="radio"
            name="resolution"
            value="Subset"
            onChange={this._handleSelection}
            checked={!!search.resolution}
            style={{ margin: '0.5em' }}
          />
          <span>
            Subset: {min}-{max} Å
          </span>
        </label>
        <MultipleInput
          min={MIN}
          max={MAX}
          minValue={min}
          maxValue={max}
          step="0.05"
          onChange={this._handleChange}
          aria-label="resolution range"
          style={{ height: '1.5em' }}
        />
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
    const { resolution, search: _, ..._search } = search;
    // add to search
    _search.group_by = 'resolution';
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
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  loadData(getUrlFor)(ExperimentTypeFilter),
);
