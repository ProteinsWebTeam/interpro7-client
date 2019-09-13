import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Loading from 'components/SimpleCommonComponents/Loading';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
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

const jobAccessionSelector = createSelector(
  customLocation => customLocation.description.result.accession,
  value => value,
);

const _IPScanResultSafeGuardIfNotRehydratedYet = (
  { jobs, ...props } /*: {jobs: Object} */,
) => {
  if (!jobs) return <Loading />;
  return <IPScanResult {...props} />;
};
_IPScanResultSafeGuardIfNotRehydratedYet.propTypes = {
  jobs: T.object,
};
const jobSelector = createSelector(
  state => state.jobs,
  jobs => ({ jobs }),
);
const IPScanResultSafeGuardIfNotRehydratedYet = connect(jobSelector)(
  _IPScanResultSafeGuardIfNotRehydratedYet,
);

const InterProScanInnerSwitch = props => (
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

const downloadSelector = createSelector(
  customLocation => customLocation.hash,
  hash => hash,
);

const downloadRoutes = new Map([[/^\//, DownloadForm]]);

const Download = props => (
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
          <ul className={f('tabs', 'menu-style')}>
            <li className={f('tabs-title')}>
              <Link
                to={{
                  description: {
                    main: { key: 'result' },
                    result: { type: 'InterProScan' },
                  },
                }}
                activeClass={({
                  description: {
                    result: { type },
                  },
                }) =>
                  type === 'InterProScan' && f('is-active', 'is-active-tab')
                }
              >
                Your InterProScan searches
              </Link>
            </li>
            <li className={f('tabs-title')}>
              <Link
                to={{
                  description: {
                    main: { key: 'result' },
                    result: { type: 'download' },
                  },
                }}
                activeClass={({
                  description: {
                    result: { type },
                  },
                }) => type === 'download' && f('is-active', 'is-active-tab')}
              >
                Your downloads
              </Link>
            </li>
          </ul>
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

const jobTypeSelector = createSelector(
  customLocation => customLocation.description.result.type,
  value => value,
);

const Jobs = () => (
  <Switch
    locationSelector={jobTypeSelector}
    indexRoute={RedirectToIPScan}
    childRoutes={routes}
  />
);

export default Jobs;
