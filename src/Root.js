import React from 'react';
import {Helmet} from 'react-helmet';

import {schedule} from 'timing-functions/src';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/global.css';
import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import AsyncComponent from 'utilityComponents/AsyncComponent';

import Overlay from 'components/Overlay';

import Sentinel from 'components/Sentinel';
import Header from 'components/Header';
import Breadcrumb from 'components/Breadcrumb';

import Pages from 'Pages';

const STICKY_MENU_OFFSET = 150;

const Root = () => (
  <div>
    <Helmet
      titleTemplate="%s - InterPro"
      defaultTitle="InterPro"
    />
    <Overlay />
    <AsyncComponent
      getComponent={async () => {
        // eslint-disable-next-line no-magic-numbers
        await schedule(1000);// Schedule asap, but do it anyway after 1s
        return (
          import(/* webpackChunkName: "side-menu" */'components/Menu/SideMenu')
        );
      }}
    />
    <Header stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Sentinel top={STICKY_MENU_OFFSET} />
    <Breadcrumb stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Pages />
    <AsyncComponent
      getComponent={async () => {
        // eslint-disable-next-line no-magic-numbers
        await schedule(1000);// Schedule asap, but do it anyway after 1s
        return (
          import(/* webpackChunkName: "ebi-footer" */'components/EBIFooter')
        );
      }}
    />
    <AsyncComponent
      getComponent={async () => {
        // eslint-disable-next-line no-magic-numbers
        await schedule(1000);// Schedule asap, but do it anyway after 1s
        return import(
          /* webpackChunkName: "toast-display" */'components/Toast/ToastDisplay'
        );
      }}
    />
    <AsyncComponent
      getComponent={async () => {
        // eslint-disable-next-line no-magic-numbers
        await schedule(5000);// Schedule asap, but do it anyway after 5s
        try {
          if (document.cookie.match(/cookies-accepted=(true)/i)[1]) return;
        } catch (_) {
          return import(
            /* webpackChunkName: "cookie-banner" */'components/CookieBanner'
          );
        }
      }}
    />
  </div>
);

export default Root;
