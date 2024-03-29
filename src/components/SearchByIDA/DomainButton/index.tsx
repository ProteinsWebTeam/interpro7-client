import React from 'react';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';

const css = cssBinder(local);

const DEFAULT_DOMAIN_WIDTH = 30;
const DEFAULT_DOMAIN_HEIGHT = 18;
const DEFAULT_LINE_WIDTH = 7;

type Props = {
  label: string;
  fill?: string;
  stroke?: string;
  width?: number;
  height?: number;
  lineW?: number;
};

const DomainButton = ({
  label,
  fill = '#aaa',
  stroke = '#333',
  width = DEFAULT_DOMAIN_WIDTH,
  height = DEFAULT_DOMAIN_HEIGHT,
  lineW = DEFAULT_LINE_WIDTH,
}: Props) => {
  const midY = height / 2;
  return (
    <svg
      className={css('ida-button')}
      width={width + 2 * lineW + 2 * midY}
      height={height + 2}
    >
      <line
        stroke={stroke}
        strokeWidth={3}
        x1={0}
        y1={midY}
        x2={width + 2 * lineW + 2 * midY}
        y2={midY}
      />
      <path
        className="feature"
        d={`M${midY},0h${width},0a${midY},${midY} 0 0 1 ${midY},${midY}v2a${midY},${midY} 0 0 1 -${midY},${midY}h-${width}a${midY},${midY} 0 0 1 -${midY},-${midY}v-2a${midY},${midY} 0 0 1 ${midY},-${midY}Z`}
        fill={fill}
        stroke={stroke}
        transform={`translate(${lineW}, 0)`}
      />
      <text x={lineW + midY + width / 2} y={height - 2} textAnchor="middle">
        {label}
      </text>
    </svg>
  );
};

export default DomainButton;
