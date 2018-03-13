import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash-es/debounce';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';

const f = foundationPartial(ebiGlobalStyles);

const DEBOUNCE_RATE = 500; // In ms

const MIN = 1;
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

  componentWillReceiveProps({ customLocation: { search: { length } } }) {
    if (!length) this.setState({ min: MIN, max: MAX });
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
            ? Math.min(max, Math.max(MIN, Math.round(Math.exp(+value))))
            : Math.max(min, Math.min(MAX, Math.round(Math.exp(+value)))),
      }),
      this._updateLocation,
    );

  render() {
    const { min, max } = this.state;
    return (
      <div style={{ display: 'block', height: 70 }}>
        <br />
        <MultipleInput
          min={Math.log(MIN)}
          max={Math.log(MAX)}
          minValue={Math.log(min)}
          maxValue={Math.log(max)}
          step="0.00001"
          onChange={this._handleChange}
          aria-label="length range"
        />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(LengthFilter);
