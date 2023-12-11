import React from 'react';

import { noop } from 'lodash-es';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

type Props = {
  name?: string;
  id: string;
  size?: string;
  switchCond: boolean;
  disabled?: boolean;
  label?: string;
  SRLabel?: string;
  onValue?: string;
  offValue?: string;
  handleChange?: (evt?: React.ChangeEvent) => void;
  addAccessionStyle?: boolean;
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
  handleChange = noop,
  addAccessionStyle = false,
}: Props) => {
  return (
    <div className={css('switch', size)}>
      <label htmlFor={id}>
        <input
          type="checkbox"
          checked={switchCond}
          className={css('switch-input')}
          name={name}
          id={id}
          onChange={handleChange}
          disabled={disabled}
        />
        {label}
        <label
          className={css(
            'switch-paddle',
            addAccessionStyle ? 'accession-selector' : '',
            disabled ? 'disabled' : '',
          )}
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
