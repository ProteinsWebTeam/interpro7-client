import React, { PropsWithChildren } from 'react';

import cssBinder from '../src/styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
const css = cssBinder(fonts);

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const mode = primary ? 'vf-button--primary' : 'vf-button--secondary';
  return (
    <button
      type="button"
      className={css('vf-button', mode, 'icon', 'icon-common', 'ico-neutral')}
      data-icon="&#xf0f4;"
      style={{ backgroundColor }}
      {...props}
    >
      {children}
    </button>
  );
};
