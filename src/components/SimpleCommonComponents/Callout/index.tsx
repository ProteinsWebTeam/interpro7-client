import React, { PropsWithChildren, useState } from 'react';

import cssBinder from 'styles/cssBinder';

import local from './styles.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

type Props = PropsWithChildren<{
  icon?: string;
  showIcon?: boolean;
  alt?: boolean;
  type: 'info' | 'alert' | 'warning' | 'announcement';
  style?: React.CSSProperties;
  className?: string;
  closable?: boolean;
  onClose?: () => void;
}>;

const defaultIcons = {
  info: 'icon-info',
  warning: 'icon-exclamation-triangle',
  alert: 'icon-exclamation-circle',
  announcement: 'icon-announcement',
};

const Callout = ({
  type,
  icon,
  alt = false,
  style = {},
  className = '',
  showIcon,
  closable = false,
  onClose,
  children,
}: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  const iconClass = icon ? icon : defaultIcons[type];

  return (
    <div
      className={css('new-callout', type, className, {
        alt,
        'with-close': closable,
      })}
      style={{ ...style }}
    >
      {showIcon && (
        <span
          className={css('icon', 'icon-common', 'icon-conceptual', iconClass)}
        />
      )}
      <div className={css('callout-content')}>{children}</div>
      {closable && (
        <button
          onClick={handleClose}
          className={css('close-button', 'xs')}
          aria-label="Close callout"
        >
          <span className={css('icon', 'icon-common', 'icon-close')} />
        </button>
      )}
    </div>
  );
};

export default Callout;
