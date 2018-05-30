import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataWebPage } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiGlobalStyles, ipro);

const IPScanStatus = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status'),
});

const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
});
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const RedirectToIPScan = () => (
  <Redirect
    to={{
      description: { main: { key: 'job' }, job: { type: 'InterProScan' } },
    }}
  />
);

const jobAccessionSelector = createSelector(
  customLocation => customLocation.description.job.accession,
  value => value,
);

const InnerSwitch = props => (
  <Wrapper>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={jobAccessionSelector}
        indexRoute={IPScanStatus}
        catchAll={IPScanResult}
      />
    </ErrorBoundary>
  </Wrapper>
);

const routes = new Map([['InterProScan', InnerSwitch]]);

class Wrapper extends PureComponent {
  static propTypes = {
    children: T.node.isRequired,
  };

  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns', 'margin-bottom-large')}>
          <h3>Jobs</h3>
          <SchemaOrgData
            data={{
              name: 'InterPro Jobs Page',
              description:
                'The webpage were the result of job requests can be found',
              location: window.location,
            }}
            processData={schemaProcessDataWebPage}
          />
          <ul className={f('tabs', 'main-style', 'margin-top-large')}>
            <li
              className={f('tabs-title')}
              onMouseOver={IPScanStatus.preload}
              onFocus={IPScanStatus.preload}
            >
              <Link
                to={{
                  description: {
                    main: { key: 'job' },
                    job: { type: 'InterProScan' },
                  },
                }}
                activeClass={({
                  description: {
                    job: { type },
                  },
                }) =>
                  type === 'InterProScan' && f('is-active', 'is-active-tab')
                }
              >
                InterProScan
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
  customLocation => customLocation.description.job.type,
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
