// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import classname from 'classnames/bind';

import style from './style.css';

import save from 'images/icons/ico-ebi-save.svg';
import download from 'images/icons/ico-ebi-download.svg';

const s = classname.bind(style);

const CENTER = 60;
const RADIUS = 48;
const STROKE_WIDTH = CENTER - RADIUS;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/*:: type Props = {
  downloading: boolean,
  success: boolean,
  failed: boolean,
  progress: number,
}; */

class ProgressButton extends PureComponent /*:: <Props> */ {
  static propTypes = {
    downloading: T.bool.isRequired,
    success: T.bool.isRequired,
    failed: T.bool.isRequired,
    progress: T.number.isRequired,
  };

  render() {
    const { downloading, success, progress, failed } = this.props;
    return (
      <span className={s('container', { failed })}>
        <svg
          width="3em"
          height="3em"
          viewBox={`0 0 ${2 * CENTER} ${2 * CENTER}`}
          className={s('svg')}
        >
          <g className={s('group', { downloading })}>
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
            fill="none"
          />
          <g className={s('card', { flipped: success })}>
            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={s('back')}
              href={download}
            />

            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={s('front')}
              href={save}
            />
          </g>
        </svg>
      </span>
    );
  }
}

export default ProgressButton;
