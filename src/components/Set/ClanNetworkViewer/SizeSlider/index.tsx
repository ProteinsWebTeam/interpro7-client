import React, { useId } from 'react';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';

const css = cssBinder(style);

const MIN = 0.5;
const MAX = 2;
const STEP = 0.1;

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const SizeSlider = ({ label, value, onChange }: Props) => {
  const id = useId();
  return (
    <div className={css('clan-network-size-slider')}>
      <label htmlFor={id}>{label}</label>{' '}
      <input
        id={id}
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />{' '}
      <span>{Math.round(value * 100)}%</span>
    </div>
  );
};

export default SizeSlider;
