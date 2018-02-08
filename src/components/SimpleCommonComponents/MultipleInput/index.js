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
      <div className={s('multirange', className)} style={style}>
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
