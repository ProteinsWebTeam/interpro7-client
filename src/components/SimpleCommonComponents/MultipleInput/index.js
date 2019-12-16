// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import classname from 'classnames/bind';

import styles from './style.css';

const s = classname.bind(styles);

const type = T.oneOfType([T.number, T.string]);

/*:: type Props = {
  min?: string | number,
  max?: string | number,
  minValue: number,
  maxValue: number,
  'aria-label'?: string,
  style?: Object,
  className?: string
}; */
class MultipleInput extends PureComponent /*:: <Props> */ {
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
      <div className={s('multirange-wrapper', 'label-off', className)}>
        <div className={s('small', 'label-min')} style={{ left: 20 }}>
          {arialLabel === 'length range' ? (
            <span>
              {Math.round(Math.exp(minValue))}
              {
                // AA
              }
            </span>
          ) : (
            <span>
              {minValue}
              {
                // Å
              }
            </span>
          )}
        </div>

        <div className={s('small', 'label-max')} style={{ right: 16 }}>
          {arialLabel === 'length range' ? (
            <span>
              {Math.round(Math.exp(maxValue))}
              {
                // AA
              }
            </span>
          ) : (
            <span>
              {maxValue}
              {
                // Å
              }
            </span>
          )}
        </div>
        <input
          {...props}
          type="range"
          min={min}
          max={max}
          name="min"
          value={minValue}
          className={s('original')}
          aria-label={arialLabel && `${arialLabel} lower bound`}
        />
        <input
          {...props}
          type="range"
          min={min}
          max={max}
          name="max"
          value={maxValue}
          className={s('ghost')}
          aria-label={arialLabel && `${arialLabel} higher bound`}
        />
      </div>
    );
  }
}

export default MultipleInput;
