import React from 'react';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

const CENTER = 90;
const RADIUS = 70;
const STROKE_WIDTH = CENTER - RADIUS;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  downloading: boolean;
  success?: boolean;
  failed: boolean;
  progress: number;
  showIcon?: boolean;
  iconType?: string;
};

const ProgressButton = ({
  downloading,
  success,
  progress,
  failed,
  showIcon = true,
}: Props) => {
  const iconClass = success ? 'icon-save' : 'icon-download-alt';

  return (
    <>
      <span className={css('container', { failed })}>
        <svg
          width="2em"
          height="2em"
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
        </svg>
        {showIcon && (
          <span
            className={css('download-icon', 'icon', 'icon-common', iconClass)}
          />
        )}
      </span>
    </>
  );
};

export default ProgressButton;
