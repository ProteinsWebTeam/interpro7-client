import React from 'react';

import cssBinder from 'styles/cssBinder';

import style from './style.css';

import save from 'images/icons/ico-ebi-save.svg';
import download from 'images/icons/ico-ebi-download.svg';

const css = cssBinder(style);

const CENTER = 60;
const RADIUS = 48;
const STROKE_WIDTH = CENTER - RADIUS;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  downloading: boolean;
  success?: boolean;
  failed: boolean;
  progress: number;
  showIcon?: boolean;
};

const ProgressButton = ({
  downloading,
  success,
  progress,
  failed,
  showIcon = true,
}: Props) => {
  return (
    <span className={css('container', { failed })}>
      <svg
        width="3em"
        height="3em"
        viewBox={`0 0 ${2 * CENTER} ${2 * CENTER}`}
        className={css('svg')}
      >
        <g className={css('group', { downloading })}>
          <circle
            cx={CENTER}
            cy={CENTER}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            r={RADIUS}
            opacity={downloading ? 1 : 0}
            fill="none"
            className={css('progress')}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            // circle inside the progress circle (+1 to account for interpolat.)
            r={RADIUS - STROKE_WIDTH / 2 + 1}
            fill="none"
          />
        </g>
        {showIcon && (
          <g className={css('icon-flip', { flipped: success })}>
            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={css('back')}
              xlinkHref={download}
            />

            <image
              x="30"
              y="10"
              width="60"
              height="100"
              className={css('front')}
              xlinkHref={save}
            />
          </g>
        )}
      </svg>
    </span>
  );
};

export default ProgressButton;
