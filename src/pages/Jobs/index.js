// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Link from 'components/generic/Link';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const IPScanStatus = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-status" */ 'components/IPScan/Status'),
});

const IPScanResult = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-page" */ 'pages/Sequence'),
});

const RedirectToIPScan = () => (
  <Redirect
    to={{
      description: { main: { key: 'job' }, job: { type: 'InterProScan' } },
    }}
  />
);

const InnerSwitch = props => (
  <Wrapper>
    <ErrorBoundary>
      <Switch
        {...props}
        locationSelector={l => l.description.job.accession}
        indexRoute={IPScanStatus}
        catchAll={IPScanResult}
      />
    </ErrorBoundary>
  </Wrapper>
);

const routes = new Set([{ value: 'InterProScan', component: InnerSwitch }]);

class Wrapper extends PureComponent {
  static propTypes = {
    children: T.node.isRequired,
  };

  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns', 'margin-bottom-large')}>
          <h3>Jobs</h3>
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
                activeClass={({ description: { job: { type } } }) =>
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

const Jobs = () => (
  <Switch
    locationSelector={l => l.description.job.type}
    indexRoute={RedirectToIPScan}
    childRoutes={routes}
  />
);

export default Jobs;
