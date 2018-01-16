// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import Redirect from 'components/generic/Redirect';
import Loading from 'components/SimpleCommonComponents/Loading';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import getTableAccess, { IPScanJobsData } from 'storage/idb';

import styles from 'styles/blocks.css';
import global from 'styles/global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, global, pageStyle, ipro, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/IPScan/Summary'),
});

const EntrySubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'),
});

const SequenceSubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-subpage" */ 'subPages/Sequence'),
});

const subPagesForSequence = new Set([
  { value: 'entry', component: EntrySubPage },
  { value: 'sequence', component: SequenceSubPage },
]);

class IPScanResult extends PureComponent {
  static propTypes = {
    metadata: T.object,
    accession: T.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this._dataTA = getTableAccess(IPScanJobsData);
  }

  _getJobData = async () => {
    const { metadata: { localID, hasData } } = this.props;
    if (!(localID && hasData)) return;
    const dataT = await this._dataTA;
    this.setState({ data: await dataT.get(localID) });
  };

  componentDidMount() {
    this._getJobData();
  }

  componentWillReceiveProps() {
    this._getJobData();
  }

  render() {
    const { metadata, accession } = this.props;
    const { data } = this.state;
    if (!data) return <Loading />;
    if (accession === metadata.localID && metadata.remoteID) {
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'job' },
              job: { type: 'InterProScan', accession: metadata.remoteID },
            },
          }}
        />
      );
    }
    let entries = NaN;
    if (data && data.entries) {
      entries =
        data.results[0].matches.length +
        new Set(
          data.results[0].matches.map(m => (m.signature.entry || {}).accession),
        ).size;
    }
    return [
      <ErrorBoundary key="browse">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <BrowseTabsWithoutData
              key="browse"
              mainType="sequence"
              mainDB=""
              mainAccession={accession}
              data={{
                loading: false,
                payload: { metadata: { counters: { entries } } },
              }}
            />
          </div>
        </div>
      </ErrorBoundary>,
      <ErrorBoundary key="switch">
        <Switch
          {...this.props}
          locationSelector={l => {
            const { key } = l.description.main;
            return (
              l.description[key].detail ||
              (Object.entries(l.description).find(
                ([_key, value]) => value.isFilter,
              ) || [])[0]
            );
          }}
          indexRoute={SummaryAsync}
          childRoutes={subPagesForSequence}
        />
      </ErrorBoundary>,
    ];
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.job.accession,
  state => state.jobs,
  (accession, jobs) => {
    let job = jobs[accession];
    if (!job) {
      job = Object.values(jobs).find(
        job => job && job.metadata && job.metadata.remoteID === accession,
      );
    }
    job = job || {};
    return { accession, metadata: job.metadata || {} };
  },
);

export default connect(mapStateToProps)(IPScanResult);
