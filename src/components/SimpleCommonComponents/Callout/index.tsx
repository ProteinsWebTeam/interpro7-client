import React, { PropsWithChildren } from 'react';

import cssBinder from 'styles/cssBinder';

import local from './styles.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

type Props = PropsWithChildren<{
  customIcon?: string;
  alt?: boolean;
  type: 'info' | 'alert' | 'warning' | 'announcement';
}>;

const defaultIcons = {
  info: 'icon-info',
  warning: 'icon-exclamation-triangle',
  alert: 'icon-exclamation-circle',
  announcement: 'icon-announcement',
};
const Callout = ({ type, customIcon, alt = false, children }: Props) => {
  let icon = customIcon ? customIcon : defaultIcons[type];
  return (
    <div className={css('new-callout', type, { alt })}>
      {icon && (
        <>
          <span className={css('icon', 'icon-common', icon)} />
        </>
      )}
      {children}
    </div>
  );
};
export default Callout;
