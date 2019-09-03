// @flow
/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import s from '../../../FiltersPanel/style.css';
import styles from './style.css';

const f = foundationPartial(styles, s);

const DEBOUNCE_RATE = 500; // In ms

const MIN = 0;
const MAX = 20;

const RESOLUTION_RANGE_REGEXP = /^(\d*(\.\d+)?)-(\d*(\.\d+)?)$/;

/*:: type Props = {
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object,
  }
}; */

/*:: type State = {
  min: number,
  max: number
}; */

export class ResolutionFilter extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props /*: Props */) {
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
    const { page, resolution: _, ...search } = { ...customLocation.search };
    if (fromMount && page) search.page = page;
    if (min !== MIN || max !== MAX) search.resolution = `${min}-${max}`;
    if (
      customLocation.search.page !== search.page ||
      customLocation.search.resolution !== search.resolution
    ) {
      goToCustomLocation({ ...customLocation, search }, true);
    }
  }, DEBOUNCE_RATE);

  _handleSelection = ({ target: { value } }) => {
    const { page, resolution: _, ...search } = this.props.customLocation.search;
    if (value !== 'All') {
      search.resolution = `${this.state.min}-${this.state.max}`;
    }
    this.setState({ min: MIN, max: MAX });
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
    const {
      customLocation: {
        search: { resolution },
      },
    } = this.props;
    const { min, max } = this.state;
    return (
      <div className={f('column')}>
        <label className={f('row', 'filter-button')}>
          <input
            type="radio"
            name="resolution"
            value="All"
            onChange={this._handleSelection}
            checked={!resolution}
            className={f('radio')}
          />
          <span>All</span>
        </label>
        <label className={f('row', 'filter-button')}>
          <input
            type="radio"
            name="resolution"
            value="Subset"
            onChange={this._handleSelection}
            checked={!!resolution}
            className={f('radio')}
          />
          <span>
            {min} - {max} Å
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
          className={f('range', 'hideable', { hidden: !resolution })}
        />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(ResolutionFilter);
