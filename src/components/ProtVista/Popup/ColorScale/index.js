import React from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import localCSS from '../../style.css';

const f = foundationPartial(localCSS);

const COLOR_SCALE_WIDTH = 80;
const COLOR_SCALE_HEIGHT = 20;
const ColorScale = ({
  domain,
  range,
  width = COLOR_SCALE_WIDTH,
  height = COLOR_SCALE_HEIGHT,
}) => (
  <div className={f('color-scale')}>
    <span>{domain[0]}</span>
    <svg height={height} width={width}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: range[0] }} />
          <stop offset="100%" style={{ stopColor: range[1] }} />
        </linearGradient>
      </defs>
      <rect width="100%" height={height} fill="url(#grad1)" />
    </svg>
    <span>{domain[1]}</span>
  </div>
);
ColorScale.propTypes = {
  domain: T.arrayOf(T.number),
  range: T.arrayOf(T.number),
  width: T.number,
  height: T.number,
};

export default ColorScale;
