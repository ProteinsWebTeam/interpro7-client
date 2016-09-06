/* @flow */
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'foundation-sites/dist/foundation-flex.css';
import 'styles/global.css';

import Header from 'components/Header';
import SideMenu from 'components/SideMenu';

const Root = (
  {children, location}/*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Header pathname={location.pathname} />
    <SideMenu position="left" />
    {children || 'Loading...'}
  </div>
);

Root.propTypes = {
  children: T.node,
  location: T.object.isRequired,
};

export default Root;
