import React, { PropsWithChildren } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import Loading from 'components/SimpleCommonComponents/Loading';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import ErrorBoundary from 'wrappers/ErrorBoundary';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import cssBinder from 'styles/cssBinder';

const css = cssBinder();

const IPScanStatus = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status'),
  loading: false,
});

const IPScanJobStatus = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status/SequenceList'
    ),
  loading: false,
});

const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
  loading: false,
});

const DownloadSummary = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "download-summary" */ 'components/Download/Summary'
    ),
  loading: false,
});

const DownloadForm = loadable({
  loader: () =>
    import(/* webpackChunkName: "download-form" */ 'components/DownloadForm'),
  loading: false,
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const RedirectToIPScan = () => (
  <Redirect
    to={{
      description: {
        main: { key: 'result' },
        result: { type: 'InterProScan' },
      },
    }}
  />
);

const jobAccessionSelector = (customLocation: InterProLocation) =>
  customLocation.description.result.job;
const sequenceAccessionSelector = (customLocation: InterProLocation) =>
  customLocation.description.result.accession;

const _IPScanResultSafeGuardIfNotRehydratedYet = ({
  jobs,
  ...props
}: {
  jobs: Record<string, { metadata: IprscanMetaIDB }>;
  [p: string]: unknown;
}) => {
  if (!jobs) return <Loading />;
  return (
    <Switch
      {...props}
      locationSelector={sequenceAccessionSelector}
      indexRoute={IPScanJobStatus}
      catchAll={IPScanResult}
    />
  );
};

const jobSelector = createSelector(
  (state: GlobalState) => state.jobs,
  (jobs) => ({ jobs }),
);
const IPScanResultSafeGuardIfNotRehydratedYet = connect(jobSelector)(
  _IPScanResultSafeGuardIfNotRehydratedYet,
);

const InterProScanInnerSwitch = (props: Record<string, unknown>) => (
  <Wrapper>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={jobAccessionSelector}
        indexRoute={IPScanStatus}
        catchAll={IPScanResultSafeGuardIfNotRehydratedYet}
      />
    </ErrorBoundary>
  </Wrapper>
);

const downloadSelector = (customLocation: InterProLocation) =>
  customLocation.hash;

const downloadRoutes = new Map([[/^\//, DownloadForm]]);

const Download = (props: Record<string, unknown>) => (
  <Wrapper>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={downloadSelector}
        indexRoute={DownloadSummary}
        childRoutes={downloadRoutes}
        catchAll={DownloadSummary}
      />
    </ErrorBoundary>
  </Wrapper>
);

const routes = new Map([
  ['InterProScan', InterProScanInnerSwitch],
  ['download', Download],
]);

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <SchemaOrgData
        data={{
          name: 'InterPro Jobs Page',
          description:
            'The webpage were the result of job requests can be found',
          location: window.location,
        }}
        processData={schemaProcessDataWebPage}
      />
      <div className={css('tabs', 'tabs-content')}>
        <div className={css('tabs-panel', 'is-active')}>
          <ErrorBoundary>{children || ''}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

const jobTypeSelector = (customLocation: InterProLocation) =>
  customLocation.description.result.type;

const Jobs = () => (
  <>
    <Helmet>
      <title>Results</title>
    </Helmet>
    <Switch
      locationSelector={jobTypeSelector}
      indexRoute={RedirectToIPScan}
      childRoutes={routes}
    />
  </>
);

export default Jobs;
