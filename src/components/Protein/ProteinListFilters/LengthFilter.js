import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput';

import { goToCustomLocation } from 'actions/creators';

const DEBOUNCE_RATE = 500; // In ms

const MIN = 0;
const MAX = 40000;

const LENGTH_RANGE_REGEXP = /^(\d+)-(\d+)$/;

class LengthFilter extends PureComponent {
  static propTypes = {
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    const [, min = MIN, max = MAX] =
      (props.customLocation.search.length || '').match(LENGTH_RANGE_REGEXP) ||
      [];

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
    const { page, length: _, ...search } = customLocation.search;
    if (fromMount && page) search.page = page;
    if (min !== MIN || max !== MAX) search.length = `${min}-${max}`;
    goToCustomLocation({ ...customLocation, search }, true);
  }, DEBOUNCE_RATE);

  _handleChange = ({ target: { name, value } }) =>
    this.setState(
      ({ min, max }) => ({
        [name]:
          name === 'min'
            ? Math.min(max, Math.max(MIN, +value))
            : Math.max(min, Math.min(MAX, +value)),
      }),
      this._updateLocation,
    );

  render() {
    const { min, max } = this.state;
    return (
      <div>
        {min} AA
        <br />
        <MultipleInput
          min="0"
          max={MAX}
          minValue={min}
          maxValue={max}
          onChange={this._handleChange}
          aria-label="length range"
        />
        <br />
        {max} AA
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(LengthFilter);
