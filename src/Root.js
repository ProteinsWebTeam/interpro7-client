// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import { schedule } from 'timing-functions/src';

// Global stylesheets loaded here
import 'styles/foundation';
import 'ebi-framework/css/ebi-global.css';
import 'styles/global.css';
// import 'styles/theme-interpro.css';
import 'react-tippy/dist/tippy.css';
import 'styles/interpro-new.css';

import loadable from 'higherOrder/loadable';

import Overlay from 'components/Overlay';

import Sentinel from 'components/Sentinel';
import { EbiSkipToDiv } from 'components/EBIHeader';
import EBIHeader from 'components/EBIHeader';
import Header from 'components/Header';

import Pages from 'pages';

import ErrorBoundary from 'wrappers/ErrorBoundary';

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
      import(/* webpackChunkName: "embl-dropdown" */ 'components/EMBLDropdown'),
    ),
  loading: NullComponent,
});

const ElixirFooterAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "elixir-footer", webpackPreload: true */ 'components/ElixirFooter'),
    ),
  loading: NullComponent,
});

const EBIFooterAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(/* webpackChunkName: "ebi-footer", webpackPreload: true */ 'components/EBIFooter'),
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
      } catch {
        return import(/* webpackChunkName: "cookie-banner" */ 'components/CookieBanner');
      }
    }),
  loading: NullComponent,
});

const renderNull = () => null;

const Root = () => (
  <>
    <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
    <LoadingBarAsync />
    <Overlay />
    <EMBLDropdownAsync />
    <SideMenuAsync />
    <EbiSkipToDiv />
    <header>
      <EBIHeader />
      <Header stickyMenuOffset={STICKY_MENU_OFFSET} />
    </header>
    <Sentinel top={STICKY_MENU_OFFSET} />
    <Pages top={STICKY_MENU_OFFSET} />
    <footer>
      <ElixirFooterAsync />
      <EBIFooterAsync />
    </footer>
    <ErrorBoundary renderOnError={renderNull}>
      <ToastDisplayAsync />
    </ErrorBoundary>
    <ErrorBoundary renderOnError={renderNull}>
      <CookieFooterAsync />
    </ErrorBoundary>
  </>
);

export default Root;
