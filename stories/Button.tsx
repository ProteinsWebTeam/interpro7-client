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
   * Should we add an icon from https://www.ebi.ac.uk/style-lab/general/fonts/v1.3/
   */
  icon?: string;
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
  icon,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const mode = primary ? 'vf-button--primary' : 'vf-button--secondary';
  let sizeClass = '';
  if (size === 'small') sizeClass = 'vf-button--sm';
  if (size === 'large') sizeClass = 'vf-button--lg';
  return (
    <button
      type="button"
      className={css('vf-button', mode, sizeClass)}
      style={{ backgroundColor, whiteSpace: 'nowrap' }}
      {...props}
    >
      {icon && (
        <span className={css('icon', 'icon-common', 'ico-neutral', icon)} />
      )}{' '}
      {children}
    </button>
  );
};
