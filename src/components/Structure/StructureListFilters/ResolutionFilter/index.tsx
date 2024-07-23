import React, { FormEvent, PureComponent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { debounce } from 'lodash-es';

import MultipleInput from 'components/SimpleCommonComponents/MultipleInput';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';

import filterCSS from 'components/FiltersPanel/style.css';
import styles from './style.css';

const css = cssBinder(styles, filterCSS);

const DEBOUNCE_RATE = 500; // In ms

const MIN = 0;
const MAX = 100;
const ALL = -1;

/* eslint-disable no-magic-numbers */
const ranges = [
  [0, 2],
  [2, 4],
  [4, 100],
];
/* eslint-enable */

const RESOLUTION_RANGE_REGEXP = /^(\d*(\.\d+)?)-(\d*(\.\d+)?)$/;

type Props = {
  label?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};

type State = {
  min: number;
  max: number;
  selectedRange: number;
};

export class ResolutionFilter extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const [, min = MIN, , max = MAX] =
      ((props.customLocation?.search.resolution as string) || '').match(
        RESOLUTION_RANGE_REGEXP,
      ) || [];
    const selectedRange = this._getSelectedRange(Number(min), Number(max));

    this.state = {
      min: Math.min(MAX, Math.max(MIN, +min)),
      max: Math.max(MIN, Math.min(MAX, +max)),
      selectedRange,
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

  _getSelectedRange(min: number, max: number) {
    if (min !== MIN || max !== MAX) {
      for (let i = 0; i < ranges.length; i++) {
        if (min < ranges[i][1]) {
          return i;
        }
      }
    }
    return ALL;
  }

  _updateLocation = debounce((fromMount?: boolean) => {
    const { min, max } = this.state;
    const { goToCustomLocation, customLocation } = this.props;
    if (!customLocation) return;
    const { page, cursor, resolution: _, ...search } = customLocation.search;

    if (fromMount && page) search.page = page;
    if (min !== MIN || max !== MAX) search.resolution = `${min}-${max}`;
    if (
      customLocation.search.page !== search.page ||
      customLocation.search.resolution !== search.resolution
    ) {
      goToCustomLocation?.({ ...customLocation, search }, true);
    }
  }, DEBOUNCE_RATE);

  _handleSelection = ({ target }: FormEvent) => {
    if (!this.props.customLocation) return;
    const value = (target as HTMLInputElement).value;
    const {
      page,
      cursor,
      resolution: _,
      ...search
    } = this.props.customLocation.search;
    if (+value !== ALL && +value < ranges.length) {
      const [min, max] = ranges[+value];
      search.resolution = `${min}-${max}`;
      this.setState({
        min,
        max,
        selectedRange: +value,
      });
    } else {
      this.setState({ min: MIN, max: MAX, selectedRange: ALL });
    }
    this.props.goToCustomLocation?.({ ...this.props.customLocation, search });
  };

  _handleChange = ({ target }: FormEvent) => {
    if (!this.props.customLocation) return;
    const { value, name: n } = target as HTMLInputElement;
    const name = n as 'min' | 'max';
    this.setState(
      ({ min, max }: State) =>
        ({
          [name]:
            name === 'min'
              ? Math.min(max, Math.max(MIN, +value))
              : Math.max(min, Math.min(MAX, +value)),
        }) as Record<'min' | 'max', number>,
      () => {
        if (this.props.customLocation?.search.resolution)
          this._updateLocation();
      },
    );
  };

  render() {
    if (!this.props.customLocation) return null;
    const {
      customLocation: {
        search: { resolution },
      },
    } = this.props;
    const { min, max, selectedRange } = this.state;
    let disable = false;
    if (this.props.customLocation.search.experiment_type === 'nmr') {
      disable = !disable;
    }
    const step = 0.05;
    return (
      <div className={css('filter')}>
        <label
          className={css('radio-btn-label', { checked: selectedRange === ALL })}
        >
          <input
            type="radio"
            name="resolution"
            value={ALL}
            onChange={this._handleSelection}
            checked={selectedRange === ALL}
            className={css('radio-btn')}
            disabled={disable}
          />
          <span>All</span>
        </label>
        {ranges.map((range, i) => (
          <label
            key={i}
            className={css('radio-btn-label', { checked: selectedRange === i })}
          >
            <input
              type="radio"
              name="resolution"
              value={i}
              className={css('radio-btn')}
              onChange={this._handleSelection}
              checked={selectedRange === i}
              disabled={disable}
            />
            <span>
              {range[0]} - {range[1]} Å
            </span>
          </label>
        ))}
        <MultipleInput
          min={selectedRange === ALL ? MIN : ranges[selectedRange][0]}
          max={selectedRange === ALL ? MAX : ranges[selectedRange][1]}
          minValue={min}
          maxValue={max}
          step={selectedRange > 1 ? 1 : step}
          onChange={this._handleChange}
          aria-label="resolution range"
          className={css('range')}
          disabled={!resolution}
        />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  ResolutionFilter,
);
