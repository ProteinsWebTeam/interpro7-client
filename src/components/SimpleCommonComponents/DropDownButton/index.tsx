import React, { useState, PropsWithChildren, ReactElement } from 'react';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';

const css = cssBinder(s, fonts);

type Props = PropsWithChildren<{
  label: ReactElement | string;
  icon?: string;
  color?: string;
  fontSize?: string;
  extraClasses?: string;
  disabled?: boolean;
}>;

const DropDownButton = ({
  label,
  icon,
  color,
  children,
  fontSize,
  extraClasses = '',
  disabled = false,
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const handleClick = () => {
    if (!disabled) setOpen(!isOpen);
  };
  const buttonStyle: Record<string, string> = {};
  const panelStyle: Record<string, string> = {};
  if (color) {
    buttonStyle.borderColor = color;
    panelStyle.borderColor = color;
  }
  if (fontSize) {
    buttonStyle.fontSize = fontSize;
    panelStyle.fontSize = fontSize;
  }
  return (
    <div
      className={`${css(
        'small',
        'dropdown-container',
        extraClasses,
        disabled ? 'disableDropdown' : '',
      )}`}
    >
      <button
        className={css(
          'vf-button',
          'vf-button--secondary',
          'vf-button--sm',
          'dropdown-button',
        )}
        style={buttonStyle}
        onClick={handleClick}
      >
        {icon ? (
          <span className={css('icon', 'icon-common')} data-icon={icon} />
        ) : null}
        <span className={css('hide-for-small-only')}>{label}</span>{' '}
        <span className={css('icon', 'icon-common', 'icon-caret-down')} />
      </button>
      <div
        className={css('dropdown-pane', 'dropdown-content')}
        style={{
          ...panelStyle,
          transform: `scaleY(${isOpen ? 1 : 0})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DropDownButton;
