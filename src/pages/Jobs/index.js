import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet-async';

import Loading from 'components/SimpleCommonComponents/Loading';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import ErrorBoundary from 'wrappers/ErrorBoundary';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const IPScanStatus = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status'),
});

const IPScanJobStatus = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status/SequenceList'
    ),
});

const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
});

const DownloadSummary = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "download-summary" */ 'components/Download/Summary'
    ),
});

const DownloadForm = loadable({
  loader: () =>
    import(/* webpackChunkName: "download-form" */ 'components/DownloadForm'),
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

const jobAccessionSelector = (customLocation) =>
  customLocation.description.result.job;
const sequenceAccessionSelector = (customLocation) =>
  customLocation.description.result.accession;

const _IPScanResultSafeGuardIfNotRehydratedYet = (
  { jobs, ...props } /*: {jobs: Object} */,
) => {
  if (!jobs) return <Loading />;
  return (
    <Switch
      {...props}
      locationSelector={sequenceAccessionSelector}
      indexRoute={IPScanJobStatus}
      catchAll={IPScanResult}
    />
  );

  // return <IPScanJobStatus {...props} />;
};
_IPScanResultSafeGuardIfNotRehydratedYet.propTypes = {
  jobs: T.object,
};
const jobSelector = createSelector(
  (state) => state.jobs,
  (jobs) => ({ jobs }),
);
const IPScanResultSafeGuardIfNotRehydratedYet = connect(jobSelector)(
  _IPScanResultSafeGuardIfNotRehydratedYet,
);

const InterProScanInnerSwitch = (props) => (
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

const downloadSelector = (customLocation) => customLocation.hash;

const downloadRoutes = new Map([[/^\//, DownloadForm]]);

const Download = (props) => (
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
/*:: type Props = {
  children: Node
};*/
class Wrapper extends PureComponent /*:: <Props> */ {
  static propTypes = {
    children: T.node.isRequired,
  };

  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns', 'margin-bottom-large')}>
          <SchemaOrgData
            data={{
              name: 'InterPro Jobs Page',
              description:
                'The webpage were the result of job requests can be found',
              location: window.location,
            }}
            processData={schemaProcessDataWebPage}
          />
          <div className={f('tabs', 'tabs-content')}>
            <div className={f('tabs-panel', 'is-active')}>
              <ErrorBoundary>{this.props.children}</ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const jobTypeSelector = (customLocation) =>
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
