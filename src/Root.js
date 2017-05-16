import React from 'react';
import {Helmet} from 'react-helmet';

import {schedule} from 'timing-functions/src';

// Global stylesheets loaded here
import 'styles/foundation';
import 'styles/ebi-global.css';
import 'styles/global.css';
import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import {createAsyncComponent} from 'utilityComponents/AsyncComponent';

import Overlay from 'components/Overlay';

import Sentinel from 'components/Sentinel';
import Header from 'components/Header';
import Breadcrumb from 'components/Breadcrumb';

import Pages from 'Pages';

const STICKY_MENU_OFFSET = 150;
const DEFAULT_SCHEDULE_DELAY = 1000;

const SideMenuAsync = createAsyncComponent(
  () => schedule(DEFAULT_SCHEDULE_DELAY).then(() => import(
    /* webpackChunkName: "side-menu" */'components/Menu/SideMenu'
  ))
);

const EBIFooterAsync = createAsyncComponent(
  () => schedule(DEFAULT_SCHEDULE_DELAY).then(() => import(
    /* webpackChunkName: "ebi-footer" */'components/EBIFooter'
  ))
);

const ToastDisplayAsync = createAsyncComponent(
  () => schedule(DEFAULT_SCHEDULE_DELAY).then(() => import(
    /* webpackChunkName: "toast-display" */'components/Toast/ToastDisplay'
  ))
);

const CookieFooterAsync = createAsyncComponent(
  () => schedule(2 * DEFAULT_SCHEDULE_DELAY).then(() => {
    try {
      if (document.cookie.match(/cookies-accepted=(true)/i)[1]) return;
    } catch (_) {
      return import(
        /* webpackChunkName: "cookie-banner" */'components/CookieBanner'
      );
    }
  })
);

const Root = () => (
  <div>
    <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
    <Overlay />
    <SideMenuAsync />
    <Header stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Sentinel top={STICKY_MENU_OFFSET} />
    <Breadcrumb stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Pages />
    <EBIFooterAsync />
    <ToastDisplayAsync />
    <CookieFooterAsync />
  </div>
);

export default Root;
