import React, { PropsWithChildren } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import Link from 'components/generic/Link';
import BaseLink from 'components/ExtLink/BaseLink';

import { closeEverything } from 'actions/creators';
import { ActiveClass } from 'src/menuConfig';

import cssBinder from 'styles/cssBinder';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import helperClasses from 'styles/helper-classes.css';
import styles from './style.css';

const css = cssBinder(ebiStyles, helperClasses, styles);

const isExternal = ([first, second]: string) =>
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/';

type Props = PropsWithChildren<{
  href?: string;
  to?: InterProPartialLocation | ((customLocation: InterProLocation) => void);
  closeEverything: typeof closeEverything;
  disabled?: boolean;
  className?: string;
  activeClass?: ActiveClass;
  exact?: boolean;
}>;

export const MenuItem = (props: Props) => {
  const {
    children,
    href,
    to,
    disabled = false,
    className,
    activeClass,
    exact,
    closeEverything,
    ...otherProps
  } = props;
  const CustomLink = !to && isExternal(to || href || '') ? BaseLink : Link;
  let _activeClass: ActiveClass = css('active');
  if (typeof activeClass === 'string') {
    _activeClass = cn(_activeClass, activeClass);
  } else if (typeof activeClass === 'function') {
    _activeClass = (customLocation: InterProLocation) => {
      const output = activeClass(customLocation);
      return output ? cn(output, css('active')) : false;
    };
  }
  return (
    <CustomLink
      {...otherProps}
      to={to}
      href={href}
      onClick={closeEverything}
      //@ts-expect-error until LInk has been migrated to TS
      activeClass={_activeClass}
      exact={exact}
      className={cn(className, css('menu-item', { disabled }))}
      {...(disabled
        ? { disabled: true, tabIndex: '-1', 'aria-disabled': 'true' }
        : {})}
    >
      {children}
    </CustomLink>
  );
};

export default connect(null, { closeEverything })(MenuItem);
