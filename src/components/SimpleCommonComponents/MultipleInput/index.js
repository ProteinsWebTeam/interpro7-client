import React, { PureComponent } from 'react';
import T from 'prop-types';

import classname from 'classnames/bind';

import styles from './style.css';

const s = classname.bind(styles);

const type = T.oneOfType([T.number, T.string]);

class MultipleInput extends PureComponent {
  static propTypes = {
    min: type,
    max: type,
    minValue: type.isRequired,
    maxValue: type.isRequired,
    'aria-label': T.string,
    style: T.object,
    className: T.string,
  };

  render() {
    const {
      min,
      max,
      minValue,
      maxValue,
      ['aria-label']: arialLabel,
      style,
      className,
      ...props
    } = this.props;
    return (
      <div className={s('multirange-wrapper', className)}>
        <div
          className={s('small', 'label-min')}
          style={{ position: 'absolute', top: 12, left: 0 }}
        >
          {Math.round(Math.exp(minValue))} AA
        </div>
        <div
          className={s('small', 'label-max')}
          style={{ position: 'absolute', top: 12, right: 6 }}
        >
          {Math.round(Math.exp(maxValue))} AA
        </div>
        <input
          type="range"
          min={min}
          max={max}
          name="min"
          value={minValue}
          className={s('original')}
          aria-label={arialLabel && `${arialLabel} lower bound`}
          {...props}
        />
        <input
          type="range"
          min={min}
          max={max}
          name="max"
          value={maxValue}
          className={s('ghost')}
          aria-label={arialLabel && `${arialLabel} higher bound`}
          {...props}
        />
      </div>
    );
  }
}

export default MultipleInput;
