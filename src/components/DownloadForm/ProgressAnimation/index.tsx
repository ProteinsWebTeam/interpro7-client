import React, { PureComponent } from 'react';
import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

type Props = {
  download: {
    progress: number;
    successful: boolean;
  };
};

export default class ProgressAnimation extends PureComponent<Props> {
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
      <>
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
        <div
          className={css('main-container')}
          style={{ opacity: downloading ? 1 : 0 }}
        >
          <div className={css('filter-container', 'absolute')}>
            <div className={css('left', 'side', 'absolute')} />
            <div
              className={css('moving-container', 'absolute')}
              style={{ transform: `translateX(${visualProgress * 100}%)` }}
            >
              <div className={css('trail', 'absolute')} />
              <div className={css('trail', 'ball', 'absolute')} />
              <div className={css('progress', 'ball', 'absolute')}>
                <span>{Math.floor((progress || 0) * 100)}%</span>
              </div>
            </div>
            <div className={css('right', 'side', 'absolute')} />
          </div>
          <div className={css('left', 'side', 'absolute')} />
          <div className={css('right', 'side', 'absolute')} />
        </div>
      </>
    );
  }
}
