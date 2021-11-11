// @flow
import React, { useState } from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';
import theme from 'styles/theme-interpro.css';

const fPlus = foundationPartial(s, fonts, theme);

const DropDownButton = (
  {
    label,
    icon,
    color = null,
    children,
    fontSize = null,
    extraClasses = '',
    disabled = false,
  } /*: {label: string, icon?: string, color ?: ?string, children: any, fontSize ?: ?string, extraClasses ?: string, disabled?: boolean} */,
) => {
  const [isOpen, setOpen] = useState(false);
  const handleClick = () => {
    if (!disabled) setOpen(!isOpen);
  };
  return (
    <div
      className={`${fPlus(
        'small',
        'dropdown-container',
        extraClasses,
        disabled ? 'disableDropdown' : '',
      )}`}
    >
      <button
        className={fPlus('button', 'dropdown')}
        style={{ backgroundColor: color, fontSize }}
        onClick={handleClick}
      >
        {icon ? (
          <span className={fPlus('icon', 'icon-common')} data-icon={icon} />
        ) : null}
        <span className={fPlus('hide-for-small-only')}>{label}</span>{' '}
      </button>
      <div
        className={fPlus('dropdown-pane', 'dropdown-content')}
        style={{
          borderColor: color,
          transform: `scaleY(${isOpen ? 1 : 0})`,
          fontSize: fontSize,
        }}
      >
        {children}
      </div>
    </div>
  );
};

DropDownButton.propTypes = {
  label: T.string.isRequired,
  icon: T.string,
  color: T.string,
  children: T.any,
  fontSize: T.string,
  extraClasses: T.string,
  disabled: T.bool,
};
export default DropDownButton;
