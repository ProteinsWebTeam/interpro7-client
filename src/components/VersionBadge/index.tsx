import React from 'react';
import T from 'prop-types';

import ColorHash from 'color-hash';

import cssBinder from 'styles/cssBinder';
import localStyles from './style.css';

const css = cssBinder(localStyles);

// default values for version 1.X of colorhash
/* eslint-disable no-magic-numbers */
const colorHash = new ColorHash({
  // hash: 'bkdr',
  saturation: [0.65, 0.35, 0.5],
  lightness: [0.65, 0.35, 0.5],
});
/* eslint-enable no-magic-numbers */

const DEFAULT_SIDE = 30;
const CHANGE_FIGURE_EVERY = 10;

type Props = {
  version: string;
  side?: number;
};
export const VersionBadge = ({ version, side = DEFAULT_SIDE }: Props) => {
  const n = parseInt(version, 10) / CHANGE_FIGURE_EVERY - 1;
  const r = side / 2;
  const circ = (Math.PI * 2) / n;
  const points = [];
  for (let i = 0; i <= n; i++) {
    const angle = circ * i;
    const y = Math.sin(angle) * r;
    const x = Math.sqrt(r ** 2 - y ** 2);
    if (angle <= Math.PI / 2) {
      points.push(`${r + x},${r - y}`);
    } else if (angle <= Math.PI) {
      points.push(`${r - x},${r - y}`);
      // eslint-disable-next-line
    } else if (angle <= 1.5 * Math.PI) {
      points.push(`${r - x},${r - y}`);
    } else {
      points.push(`${r + x},${r - y}`);
    }
  }
  const celebration = version === '99.0';
  // The conditional is to adjust for versions 100.0 upwards
  const proportionTextFigure = version.length < 5 ? 0.4 : 0.32;
  const yCoordForText = version.length < 5 ? 0.65 : 0.6;
  return (
    <svg width={side} height={side} className={css({ celebration })}>
      <polygon
        points={points.join(' ')}
        fill={celebration ? undefined : colorHash.hex(version)}
      />
      <text
        x={r}
        y={side * yCoordForText}
        textAnchor="middle"
        fill="white"
        fontSize={side * proportionTextFigure}
        fontWeight="bold"
        style={{ cursor: 'default' }}
      >
        {version}
      </text>
    </svg>
  );
};
VersionBadge.propTypes = {
  version: T.string.isRequired,
  side: T.number,
};

export default React.memo(VersionBadge);
