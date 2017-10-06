// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import { schedule } from 'timing-functions/src';

// Global stylesheets loaded here
import 'styles/foundation';
import 'ebi-framework/css/ebi-global.scss';
import 'styles/global.css';
// import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import loadable from 'higherOrder/loadable';

import Overlay from 'components/Overlay';

import Sentinel from 'components/Sentinel';
import { EbiSkipToDiv } from 'components/EBIHeader';
import EBIHeader from 'components/EBIHeader';
import Header from 'components/Header';
// import Breadcrumb from 'components/Breadcrumb';

import Pages from 'pages';

const STICKY_MENU_OFFSET = 110;
const DEFAULT_SCHEDULE_DELAY = 1000;

const NullComponent = () => null;

const LoadingBarAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "loading-bar" */ 'components/LoadingBar'),
    ),
  loading: NullComponent,
});

const SideMenuAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "side-menu" */ 'components/Menu/SideMenu'),
    ),
  loading: NullComponent,
});

const EMBLDropdownAsync = loadable({
  loader: () =>
    schedule(2 * DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "cookie-banner" */ 'components/EMBLDropdown'),
    ),
  loading: NullComponent,
});

const EBIFooterAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "ebi-footer" */ 'components/EBIFooter'),
    ),
  loading: NullComponent,
});

const ToastDisplayAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "toast-display" */ 'components/Toast/ToastDisplay'),
    ),
  loading: NullComponent,
});

const CookieFooterAsync = loadable({
  loader: () =>
    schedule(2 * DEFAULT_SCHEDULE_DELAY).then(() => {
      try {
        if (
          window.document &&
          window.document.cookie.match(/cookies-accepted=(true)/i)[1]
        )
          return;
      } catch (_) {
        return import(/* webpackChunkName: "cookie-banner" */ 'components/CookieBanner');
      }
    }),
  loading: NullComponent,
});

const Root = () => [
  <Helmet key="header" titleTemplate="%s - InterPro" defaultTitle="InterPro" />,
  <LoadingBarAsync key="loading-bar" />,
  <Overlay key="overlay" />,
  <EMBLDropdownAsync key="embl-dropdown" />,
  <SideMenuAsync key="side-menu" />,
  <EbiSkipToDiv key="ebi-skip-to-div" />,
  <EBIHeader key="ebi-header" />,
  <Header key="header" stickyMenuOffset={STICKY_MENU_OFFSET} />,
  <Sentinel key="sentinel" top={STICKY_MENU_OFFSET} />,
  // <Breadcrumb key="breadcrumb" stickyMenuOffset={STICKY_MENU_OFFSET} />,
  <Pages key="pages" top={STICKY_MENU_OFFSET} />,
  <EBIFooterAsync key="ebi-footer" />,
  <ToastDisplayAsync key="toast-display" />,
  <CookieFooterAsync key="cookie-footer" />,
];

export default Root;
