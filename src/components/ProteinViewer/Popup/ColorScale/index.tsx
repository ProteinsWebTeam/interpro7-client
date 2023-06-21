import React from 'react';

import cssBinder from 'styles/cssBinder';
import localCSS from './style.css';

const css = cssBinder(localCSS);

const COLOR_SCALE_WIDTH = 80;
const COLOR_SCALE_HEIGHT = 20;

type ColorScaleType = {
  domain: Array<number>;
  range: Array<string>;
  width?: number;
  height?: number;
};
const ColorScale = ({
  domain,
  range,
  width = COLOR_SCALE_WIDTH,
  height = COLOR_SCALE_HEIGHT,
}: ColorScaleType) => {
  const maxDomain = domain.slice(-1)[0];
  return (
    <div className={css('color-scale')}>
      <div className={css('legend', 'left')}>{domain[0]}</div>
      <svg height={height} width={width}>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: range[0] }} />
            {domain.slice(1).map((d, i) => (
              <stop
                key={i}
                offset={`${(100 * d) / maxDomain}%`}
                style={{ stopColor: range[i + 1] }}
              />
            ))}
          </linearGradient>
        </defs>
        <rect width="100%" height={height} fill="url(#grad1)" />
      </svg>
      <div className={css('legend', 'right')}>{maxDomain}</div>
    </div>
  );
};

export default ColorScale;
