// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import { schedule } from 'timing-functions/src';

// Global stylesheets loaded here
import 'styles/foundation';
import 'ebi-framework/css/ebi-global.scss';
// import 'styles/theme-interpro.css';
import 'styles/interpro-new.css';

import { createAsyncComponent } from 'utilityComponents/AsyncComponent';

import Overlay from 'components/Overlay';

import Sentinel from 'components/Sentinel';
import { EbiSkipToDiv } from 'components/EBIHeader';
import EBIHeader from 'components/EBIHeader';
import Header from 'components/Header';
// import Breadcrumb from 'components/Breadcrumb';

import Pages from 'Pages';

const STICKY_MENU_OFFSET = 110;
const DEFAULT_SCHEDULE_DELAY = 1000;

const NullComponent = () => null;

const LoadingBarAsync = createAsyncComponent(
  () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "loading-bar" */ 'components/LoadingBar'),
    ),
  NullComponent,
  'LoadingBar',
);

const SideMenuAsync = createAsyncComponent(
  () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "side-menu" */ 'components/Menu/SideMenu'),
    ),
  NullComponent,
  'SideMenu',
);

const EMBLDropdownAsync = createAsyncComponent(
  () =>
    schedule(2 * DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "cookie-banner" */ 'components/EMBLDropdown'),
    ),
  NullComponent,
  'EMBLDropdown',
);

const EBIFooterAsync = createAsyncComponent(
  () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "ebi-footer" */ 'components/EBIFooter'),
    ),
  NullComponent,
  'EBIFooter',
);

const ToastDisplayAsync = createAsyncComponent(
  () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "toast-display" */ 'components/Toast/ToastDisplay'),
    ),
  NullComponent,
  'ToastDisplay',
);

const CookieFooterAsync = createAsyncComponent(
  () =>
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
  NullComponent,
  'CookieFooter',
);

const Root = () =>
  <div>
    <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
    <LoadingBarAsync />
    <Overlay />
    <EMBLDropdownAsync />
    <SideMenuAsync />
    <EbiSkipToDiv />
    <EBIHeader />
    <Header stickyMenuOffset={STICKY_MENU_OFFSET} />
    <Sentinel top={STICKY_MENU_OFFSET} />
    {/* <Breadcrumb stickyMenuOffset={STICKY_MENU_OFFSET} /> */}
    <Pages top={STICKY_MENU_OFFSET} />
    <EBIFooterAsync />
    <ToastDisplayAsync />
    <CookieFooterAsync />
  </div>;

export default Root;
