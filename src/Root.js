/* @flow */
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/global.css';
import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import SideMenu from 'components/SideMenu';
import Breadcrumb from 'components/Breadcrumb';
import Loading from 'components/Loading';

const Root = (
  {children, location}/*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <SideMenu position="right" pathname={location.pathname} />
    <Header pathname={location.pathname} />
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
