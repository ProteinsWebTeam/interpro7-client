// @flow
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { schedule } from 'timing-functions';

import loadable from 'higherOrder/loadable';
import Overlay from 'components/Overlay';
import Sentinel from 'components/Sentinel';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import { schemaProcessInterProCitation } from 'schema_org/processors';

const STICKY_MENU_OFFSET = 110;
const DEFAULT_SCHEDULE_DELAY = 1000;

const NullComponent = () => null;

const Pages = loadable({
  loader: () =>
    import(
      /* webpackPreload: true */
      /* webpackChunkName: "pages" */ 'pages'
    ),
});

const EBIHeader = loadable({
  loader: () =>
    import(/* webpackChunkName: "ebi-header" */ 'components/EBIHeader'),
  loading: () => <div className="tmp-ebi-header"></div>,
});
const Header = loadable({
  loader: () =>
    import(/* webpackChunkName: "main-header" */ 'components/Header'),
  loading: () => (
    <div className="tmp-interpro-header">
      <h1>InterPro</h1>
    </div>
  ),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

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
      import(
        /* webpackChunkName: "elixir-footer", webpackPreload: true */ 'components/ElixirFooter'
      ),
    ),
  loading: NullComponent,
});

const EBIFooterAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(
        /* webpackChunkName: "ebi-footer", webpackPreload: true */ 'components/EBIFooter'
      ),
    ),
  loading: NullComponent,
});

const ToastDisplayAsync = loadable({
  loader: () =>
    schedule(DEFAULT_SCHEDULE_DELAY).then(() =>
      import(
        /* webpackChunkName: "toast-display" */ 'components/Toast/ToastDisplay'
      ),
    ),
  loading: NullComponent,
});

const CookieFooterAsync = () => {
  try {
    if (
      window.document &&
      window.document.cookie.match(/cookies-accepted=(true)/i)[1]
    )
      return null;
  } catch {
    const CookieBanner = loadable({
      loader: () =>
        schedule(2 * DEFAULT_SCHEDULE_DELAY).then(() => {
          return import(
            /* webpackChunkName: "cookie-banner" */ 'components/CookieBanner'
          );
        }),
    });
    return <CookieBanner />;
  }
  return null;
};
const renderNull = () => null;

const Root = () => (
  <div id="interpro-root">
    <HelmetProvider>
      <Helmet titleTemplate="%s - InterPro" defaultTitle="InterPro" />
      <SchemaOrgData processData={schemaProcessInterProCitation} />
      <LoadingBarAsync />
      <Overlay />
      <EMBLDropdownAsync />
      <SideMenuAsync />
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
    </HelmetProvider>
  </div>
);

export default Root;
