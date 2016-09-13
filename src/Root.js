/* @flow */
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/global.css';

import Header from 'components/Header';
import SideMenu from 'components/SideMenu';
import Loading from 'Loading';

const Root = (
  {children, location}/*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Header pathname={location.pathname} />
    <SideMenu position="left" />
    <Loading>{children}</Loading>
  </div>
);

Root.propTypes = {
  children: T.node,
  location: T.object.isRequired,
};

export default Root;
