/* @flow */
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/interpro-new.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import SideMenu from 'components/SideMenu';
import Breadcrumb from 'components/Breadcrumb';
import Loading from 'Loading';

const Root = (
  {children, location}/*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Header pathname={location.pathname} />
    <SideMenu position="right" />
    <Breadcrumb pathname={location.pathname} />
    <Loading>{children}</Loading>
    <Footer />
  </div>
);

Root.propTypes = {
  children: T.node,
  location: T.object.isRequired,
};

export default Root;
