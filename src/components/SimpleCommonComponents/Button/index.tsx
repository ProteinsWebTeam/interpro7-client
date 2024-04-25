import React, { PropsWithChildren } from 'react';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  type?: 'primary' | 'secondary' | 'tertiary' | 'hollow';
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * What text color to use
   */
  textColor?: string;
  /**
   * What border color to use
   */
  borderColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Should we add an icon from https://www.ebi.ac.uk/style-lab/general/fonts/v1.3/
   */
  icon?: string;
  /**
   * Optional click handler
   */
  style?: React.CSSProperties;

  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  type = 'primary',
  size = 'medium',
  backgroundColor,
  textColor,
  borderColor,
  icon,
  children,
  style,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const mode = `vf-button--${type}`;
  let sizeClass = '';
  if (size === 'small') sizeClass = 'vf-button--sm';
  if (size === 'large') sizeClass = 'vf-button--lg';
  return (
    <button
      type="button"
      className={css('vf-button', mode, sizeClass)}
      style={{
        backgroundColor,
        color: textColor,
        borderColor,
        whiteSpace: 'nowrap',
        ...(style || {}),
      }}
      {...props}
    >
      {icon && (
        <span className={css('icon', 'icon-common', 'ico-neutral', icon)} />
      )}{' '}
      {children}
    </button>
  );
};
