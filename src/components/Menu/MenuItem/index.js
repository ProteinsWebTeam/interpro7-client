import React, {PureComponent} from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import {connect} from 'react-redux';

import {BaseLink} from 'components/ExtLink';

import {closeEverything} from 'actions/creators';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import helperClasses from 'styles/helper-classes.css';
import styles from './style.css';

const s = foundationPartial(ebiStyles, helperClasses, styles);

const isExternal = ([first, second]) => (
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/'
);

const activeClassFn = (to, activeClass) => (location, defaultMatchFn) => {
  // check exact match for Home
  if (to === '/' || to.pathname === '/') {
    return (location.pathname === '/') ? s('active', activeClass) : '';
  }
  return defaultMatchFn(to, location) ? s('active', activeClass) : '';
};

class MenuItem extends PureComponent {
  static propTypes = {
    children: T.node.isRequired,
    to: T.string.isRequired,
    closeEverything: T.func.isRequired,
    disabled: T.bool,
    className: T.string,
    activeClass: T.string,
  };

  render() {
    const {
      children,
      to,
      disabled = false,
      className,
      activeClass,
      closeEverything,
      ...props
    } = this.props;
    const CustomLink = isExternal(to) ? BaseLink : Link;
    return (
      <CustomLink
        to={to}
        onClick={closeEverything}
        activeClass={activeClassFn(to, activeClass)}
        className={`
        ${className || ''} ${s('select-none', 'menu-item', {disabled})}
      `.trim()}
        {...(
          disabled ?
            {disabled: true, tabIndex: '-1', 'aria-disabled': 'true'} :
            {}
        )}
        {...props}
      >
        {children}
      </CustomLink>
    );
  }
}

export default connect(null, {closeEverything})(MenuItem);
