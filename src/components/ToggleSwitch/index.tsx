import React, { useState, useEffect } from 'react';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

type Props = {
  name?: string;
  id: string;
  size?: 'large' | 'small' | 'tiny';
  switchCond: boolean;
  disabled?: boolean;
  label?: string;
  SRLabel?: string;
  onValue?: string;
  offValue?: string;
  handleChange?: (evt?: React.ChangeEvent) => void;
  addAccessionStyle?: boolean;
  width?: string;
};

const ToggleSwitch = ({
  name = 'switch',
  id,
  size = 'large',
  switchCond,
  disabled = false,
  label,
  SRLabel,
  onValue = 'On',
  offValue = 'Off',
  handleChange,
  addAccessionStyle = false,
  width,
}: Props) => {
  const [isOn, setIsOn] = useState(switchCond);
  useEffect(() => {
    setIsOn(switchCond);
  }, [switchCond]);
  const onInputChange = (evt?: React.ChangeEvent) => {
    if (handleChange) {
      handleChange(evt);
    } else {
      setIsOn(!isOn);
    }
  };
  const paddleStyle = width ? { width } : {};
  return (
    <div className={css('new-switch', size)}>
      <label htmlFor={id}>
        <input
          type="checkbox"
          checked={isOn}
          className={css('switch-input')}
          name={name}
          id={id}
          onChange={onInputChange}
          disabled={disabled}
        />
        {label}
        <label
          className={css(
            'switch-paddle',
            addAccessionStyle ? 'accession-selector' : '',
            disabled ? 'disabled' : '',
          )}
          style={{ ...paddleStyle }}
          htmlFor={id}
        >
          {SRLabel ? (
            <span className={css('show-for-sr')}>{SRLabel}:</span>
          ) : null}
          <span className={css('switch-active')} aria-hidden="true">
            {onValue}
          </span>
          <span className={css('switch-inactive')} aria-hidden="true">
            {offValue}
          </span>
        </label>
      </label>
    </div>
  );
};

export default ToggleSwitch;
