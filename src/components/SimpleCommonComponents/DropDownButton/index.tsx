import React, { useState, PropsWithChildren, ReactElement } from 'react';

import Button, { ButtonTypes } from 'components/SimpleCommonComponents/Button';
import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import s from './style.css';

const css = cssBinder(s, fonts);

type Props = PropsWithChildren<{
  /**
   * What type of button should use, default to secondary
   */
  type?: ButtonTypes;
  /**
   * What should be the label of the component. It supports nested react element
   */
  label: ReactElement | string;
  /**
   * Should we add an icon from https://www.ebi.ac.uk/style-lab/general/fonts/v1.3/
   */
  icon?: string;
  /**
   *  What color to use for the border
   */
  color?: string;
  /**
   *  The size of the font to use. Any CSS supported value is valid. e.g. 16px, 1.2em
   */
  fontSize?: string;
  /**
   * Do you want to add any other css class to this component
   */
  extraClasses?: string;
  /**
   * To disable the component
   */
  disabled?: boolean;
}>;

const DropDownButton = ({
  type = 'secondary',
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
      <Button
        type={type}
        className={css('dropdown-button')}
        style={buttonStyle}
        icon={icon}
        onClick={handleClick}
      >
        <span className={css('hide-for-small-only')}>{label}</span>{' '}
        <span className={css('icon', 'icon-common', 'icon-caret-down')} />
      </Button>
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
