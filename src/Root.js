// @flow
import React, {PropTypes as T} from 'react';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/global.css';
import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

// import AsyncComponent from 'utilityComponents/AsyncComponent';

import Overlay from 'components/Overlay';
import Sentinel from 'components/Sentinel';
import Header from 'components/Header';
import Footer from 'components/EBIFooter';
import SideMenu from 'components/Menu/SideMenu';
import Breadcrumb from 'components/Breadcrumb';
import Loading from 'components/Loading';
import ToastDisplay from 'components/Toast';
import CookieBanner from 'components/CookieBanner';

const STICKY_MENU_OFFSET = 150;

const Root = (
  {children, location: {pathname}}
  /*: {children: Node, location: {pathname: string}}*/
) => (
  <div>
    <Overlay />
    <SideMenu pathname={pathname} />
    <Header pathname={pathname} stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Sentinel top={STICKY_MENU_OFFSET} />
    <Breadcrumb stickyMenuOffset={STICKY_MENU_OFFSET} pathname={pathname} />
    <Loading>{children}</Loading>
    <Footer />
    <ToastDisplay />
    <CookieBanner />
    {/* <AsyncComponent
      componentPath="components/CookieBanner"
      trigger={new Promise((res, rej) => {
        try {
          // access first match, means cookies accepted
          document.cookie.match(/cookies-accepted=(true)/i)[1];
          rej();
        } catch (_) {
          res();
        }
      })}
    /> */}
  </div>
);

Root.propTypes = {
  children: T.node,
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default Root;
