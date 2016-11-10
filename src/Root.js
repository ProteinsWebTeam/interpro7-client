// @flow
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/global.css';
import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import Overlay from 'components/Overlay';
import Header from 'components/Header';
import Footer from 'components/EBIFooter';
import SideMenu from 'components/Menu/SideMenu';
import Breadcrumb from 'components/Breadcrumb';
import Loading from 'components/Loading';

const Root = (
  {children, location: {pathname}}
  /*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Overlay />
    <SideMenu pathname={pathname} />
    <Header pathname={pathname} />
    <Breadcrumb pathname={pathname} />
    <Loading>{children}</Loading>
    <Footer />
  </div>
);

Root.propTypes = {
  children: T.node,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default Root;
