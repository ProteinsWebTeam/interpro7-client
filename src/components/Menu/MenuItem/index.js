import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import { connect } from 'react-redux';

import { BaseLink } from 'components/ExtLink';

import { closeEverything } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import helperClasses from 'styles/helper-classes.css';
import styles from './style.css';

const s = foundationPartial(ebiStyles, helperClasses, styles);

const isExternal = ([first, second]) =>
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/';

// const activeClassFn = (to, activeClass) => (location, defaultMatchFn) => {
//   // check exact match for Home
//   if (to === '/' || to.pathname === '/') {
//     return (location.pathname === '/') ? s('active', activeClass) : '';
//   }
//   return defaultMatchFn(to, location) ? s('active', activeClass) : '';
// };

class MenuItem extends PureComponent {
  static propTypes = {
    children: T.node.isRequired,
    href: T.string,
    to: T.string,
    newTo: T.oneOfType([T.object, T.func]),
    closeEverything: T.func.isRequired,
    disabled: T.bool,
    className: T.string,
    activeClass: T.oneOfType([T.string, T.func]),
  };

  render() {
    const {
      children,
      href,
      to,
      newTo,
      disabled = false,
      className,
      activeClass,
      closeEverything,
      ...props
    } = this.props;
    const CustomLink = !newTo && isExternal(to || href) ? BaseLink : Link;
    let _activeClass = s('active');
    if (typeof activeClass === 'string') {
      _activeClass += ` ${activeClass || ''}`;
    } else if (typeof activeClass === 'function') {
      _activeClass = (...args) => {
        const output = (activeClass(...args) || '').trim();
        if (output) return `${output} ${s('active')}`;
      };
    }
    return (
      <CustomLink
        newTo={newTo}
        href={href}
        onClick={closeEverything}
        activeClass={_activeClass}
        className={`${className || ''} ${s('select-none', 'menu-item', {
          disabled,
        })}`.trim()}
        {...(disabled
          ? { disabled: true, tabIndex: '-1', 'aria-disabled': 'true' }
          : {})}
        {...props}
      >
        {children}
      </CustomLink>
    );
  }
}

export default connect(null, { closeEverything })(MenuItem);
