// @flow
import React from 'react';
import T from 'prop-types';

import { noop } from 'lodash-es';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, local);

const ToggleSwitch = (
  {
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
  } /*: {|
    name?: string,
    id: string,
    size?: string,
    switchCond: boolean,
    disabled?: boolean,
    label?: string,
    SRLabel?: string,
    onValue?: string,
    offValue?: string,
    handleChange?: function,
    addAccessionStyle?: boolean
  |} */,
) => {
  return (
    <div className={f('switch', size)}>
      <label htmlFor={id}>
        <input
          type="checkbox"
          checked={switchCond}
          className={f('switch-input')}
          name={name}
          id={id}
          onChange={handleChange}
          disabled={disabled}
        />
        {label}
        <label
          className={f(
            'switch-paddle',
            addAccessionStyle ? 'accession-selector' : '',
            disabled ? 'disabled' : '',
          )}
          htmlFor={id}
        >
          {SRLabel ? (
            <span className={f('show-for-sr')}>{SRLabel}:</span>
          ) : null}
          <span className={f('switch-active')} aria-hidden="true">
            {onValue}
          </span>
          <span className={f('switch-inactive')} aria-hidden="true">
            {offValue}
          </span>
        </label>
      </label>
    </div>
  );
};
ToggleSwitch.propTypes = {
  name: T.string,
  id: T.string.isRequired,
  size: T.string,
  switchCond: T.bool.isRequired,
  disabled: T.bool,
  label: T.string,
  SRLabel: T.string,
  onValue: T.string,
  offValue: T.string,
  handleChange: T.func,
  addAccessionStyle: T.bool,
};

export default ToggleSwitch;
