/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import T from 'prop-types';
import classnames from 'classnames/bind';

import styles from './style.css';

const s = classnames.bind(styles);

export default class ProgressAnimation extends PureComponent {
  static propTypes = {
    download: T.shape({
      progress: T.number,
      successful: T.bool,
    }).isRequired,
  };

  render() {
    const {
      download: { progress, successful },
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    let visualProgress = 0;
    if (downloading) {
      if (progress) {
        visualProgress = progress * 0.9 + 0.05;
      } else {
        visualProgress = 0.05;
      }
    } else if (progress === 1) {
      visualProgress = 1.1;
    }

    return (
      <React.Fragment>
        <svg width="0" height="0">
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur
                in="SourceGraphic"
                result="blurred"
                stdDeviation="10"
              />
              <feColorMatrix
                in="blurred"
                result="matrix"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              />
              <feBlend in="SourceGraphic" in2="matrix" />
            </filter>
          </defs>
        </svg>
        <div className={s('main-container')}>
          <div className={s('filter-container', 'absolute')}>
            <div className={s('left', 'side', 'absolute')} />
            <div
              className={s('moving-container', 'absolute')}
              style={{ transform: `translateX(${visualProgress * 100}%)` }}
            >
              <div className={s('trail', 'absolute')} />
              <div className={s('trail', 'ball', 'absolute')} />
              <div className={s('progress', 'ball', 'absolute')}>
                <span>{Math.floor((progress || 0) * 100)}%</span>
              </div>
            </div>
            <div className={s('right', 'side', 'absolute')} />
          </div>
          <div className={s('left', 'side', 'absolute')} />
          <div className={s('right', 'side', 'absolute')} />
        </div>
      </React.Fragment>
    );
  }
}
