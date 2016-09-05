/* @flow */
import React, {PropTypes as T} from 'react';

import Header from 'components/Header';
import SideMenu from 'components/SideMenu';

import 'styles/global.css';

const Root = (
  {children, location}/*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Header pathname={location.pathname} />
    <SideMenu position="left" />
    {children}
  </div>
);

Root.propTypes = {
  children: T.node.isRequired,
  location: T.object.isRequired,
};

export default Root;
