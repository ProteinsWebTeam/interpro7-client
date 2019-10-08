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
    color = undefined,
    children,
    alignLeft = false,
    fontSize,
  } /*: {label: string, icon: string, color: ?string, children: any, alignLeft: boolean, fontSize ?: string} */,
) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className={fPlus('button-group', 'small', 'dropdown-container')}>
      <button
        className={fPlus('button', 'dropdown')}
        style={{ backgroundColor: color }}
        onClick={() => setOpen(!isOpen)}
      >
        {icon
          ? "<span className={fPlus('icon', 'icon-common')} data-icon={icon} />{' '}"
          : null}
        <span className={fPlus('hide-for-small-only')}>{label}</span>{' '}
      </button>
      <div
        className={fPlus('dropdown-pane', 'dropdown-content', {
          alignLeft,
        })}
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
  alignLeft: T.bool,
  fontSize: T.string,
};
export default DropDownButton;
