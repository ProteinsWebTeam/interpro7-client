import React, {PropTypes as T} from 'react';
import {Link} from 'react-router';

import {BaseLink} from 'components/ExtLink';

const isExternal = ([first, second]) => (
  // 'http://www.example.com'
  //  ↑
  first.toLowerCase() === 'h' ||
  // '//www.example.com'
  //   ↑
  second === '/'
);

const MenuItem = ({children, to, ...props}) => {
  const CustomLink = isExternal(to) ? BaseLink : Link;
  return <CustomLink to={to} {...props}>{children}</CustomLink>;
};
MenuItem.propTypes = {
  children: T.node.isRequired,
  to: T.string.isRequired,
  props: T.object,
};

export default MenuItem;
