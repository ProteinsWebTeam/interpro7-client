// @flow
import React from 'react';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';

const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
});

const RedirectToSearch = () => (
  <Redirect
    to={{
      description: { main: { key: 'search' }, search: { type: 'sequence' } },
    }}
  />
);

const InnerSwitch = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => l.description.job.accession}
      indexRoute={RedirectToSearch}
      catchAll={IPScanResult}
    />
  </ErrorBoundary>
);

const routes = new Set([{ value: 'InterProScan', component: InnerSwitch }]);

const Job = () => (
  <Switch
    locationSelector={l => l.description.job.type}
    indexRoute={RedirectToSearch}
    childRoutes={routes}
  />
);

export default Job;
