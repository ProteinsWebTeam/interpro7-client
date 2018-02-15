/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput/index';

import { goToCustomLocation } from 'actions/creators/index';

import classnames from 'classnames/bind';

import styles from './style.css';

const s = classnames.bind(styles);

const DEBOUNCE_RATE = 500; // In ms

const MIN = 0;
const MAX = 20;

const RESOLUTION_RANGE_REGEXP = /^(\d*(\.\d+)?)-(\d*(\.\d+)?)$/;

class ResolutionFilter extends PureComponent {
  static propTypes = {
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
    const { customLocation: { search: { resolution } } } = this.props;
    const { min, max } = this.state;
    return (
      <div>
        <label>
          <input
            type="radio"
            name="resolution"
            value="All"
            onChange={this._handleSelection}
            checked={!resolution}
            className={s('radio')}
          />
          <span>All</span>
        </label>
        <label>
          <input
            type="radio"
            name="resolution"
            value="Subset"
            onChange={this._handleSelection}
            checked={!!resolution}
            className={s('radio')}
          />
          <span>
            Subset<span className={s('hideable', { hidden: !resolution })}>
              : {min}-{max} Å
            </span>
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
          className={s('range', 'hideable', { hidden: !resolution })}
        />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  ResolutionFilter,
);
