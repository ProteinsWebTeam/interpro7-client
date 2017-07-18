// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import classname from 'classnames/bind';

import style from './style.css';

import save from 'styles/ebi/icons/save.svg';
import download from 'styles/ebi/icons/download.svg';

const s = classname.bind(style);

const CENTER = 60;
const RADIUS = 48;
const STROKE_WIDTH = CENTER - RADIUS;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

class ProgressButton extends PureComponent {
  static propTypes = {
    downloading: T.bool,
    progress: T.number,
    failed: T.bool,
  };

  render() {
    const { downloading, progress } = this.props;
    return (
      <span className={s('container')}>
        <svg
          width="2em"
          height="2em"
          viewBox={`0 0 ${2 * CENTER} ${2 * CENTER}`}
          className={s('svg')}
        >
          <g className={s('group', { downloading })}>
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              className={s('shadow', { downloading })}
              strokeWidth={STROKE_WIDTH - 1}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              r={RADIUS}
              fill="none"
              className={s('progress')}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            />
          </g>
          <circle
            cx={CENTER}
            cy={CENTER}
            // circle inside the progress circle (+1 to account for interpolat.)
            r={RADIUS - STROKE_WIDTH / 2 + 1}
            fill="#e6e6e6"
          />
          <g className={s('card')}>
            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={s('back', { flipped: progress === 1 })}
              href={download}
            />
            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={s('front', { flipped: progress === 1 })}
              href={save}
            />
          </g>
        </svg>
      </span>
    );
  }
}

export default ProgressButton;
