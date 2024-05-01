import React, { PropsWithChildren, forwardRef } from 'react';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

export type ButtonTypes =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'hollow'
  | 'inline';
interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  type?: ButtonTypes;
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
   * Any aditional CSS class to add to the button
   */
  className?: string;
  /**
   * Object of React CSS properties to add to the button
   */
  style?: React.CSSProperties;
  /**
   * Should use as submit button
   */
  submit?: boolean;

  /**
   * Optional click handler
   */
  onClick?: () => void;

  [otherProp: string]: unknown;
}

export type Ref = HTMLButtonElement;

/**
 * Primary UI component for user interaction
 */
export const Button = forwardRef<Ref, PropsWithChildren<ButtonProps>>(
  (
    {
      type = 'primary',
      size = 'small',
      backgroundColor,
      textColor,
      borderColor,
      icon,
      children,
      className,
      style,
      submit = false,
      ...props
    },
    ref,
  ) => {
    const mode = `vf-button--${type}`;
    let sizeClass = '';
    if (size === 'small') sizeClass = 'vf-button--sm';
    if (size === 'large') sizeClass = 'vf-button--lg';
    return (
      <button
        ref={ref}
        type={submit ? 'submit' : 'button'}
        className={`${css('vf-button', mode, sizeClass)} ${className || ''}`}
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
        )}
        {children}
      </button>
    );
  },
);
export default Button;
