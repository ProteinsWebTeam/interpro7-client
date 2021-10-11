import React from 'react';
import T from 'prop-types';

import ColorHash from 'color-hash';

// default values for version 1.X of colorhash
const colorHash = new ColorHash({
  hash: 'bkdr',
  saturation: [0.65, 0.35, 0.5],
  lightness: [0.65, 0.35, 0.5],
});

const DEFAULT_SIDE = 30;
const CHANGE_FIGURE_EVERY = 10;

export const VersionBadge = (
  { version, side = DEFAULT_SIDE } /*: {version: string, side?: number} */,
) => {
  const n = parseInt(version / CHANGE_FIGURE_EVERY, 10) - 1;
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
  const proportionTextFigure = 0.4;
  const yCoordForText = 0.65;
  return (
    <svg width={side} height={side}>
      <polygon points={points.join(' ')} fill={colorHash.hex(version)} />
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
