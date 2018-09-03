import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import Loading from 'components/SimpleCommonComponents/Loading';
import loadable from 'higherOrder/loadable';

import getTableAccess, { IPScanJobsData } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, pageStyle, ipro, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-summary" */ 'components/IPScan/Summary'),
});

const EntrySubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'),
});

const SequenceSubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-subpage" */ 'subPages/Sequence'),
});

const subPagesForSequence = new Map([
  ['entry', EntrySubPage],
  ['sequence', SequenceSubPage],
]);

const locationSelector = createSelector(
  customLocation => {
    const { key } = customLocation.description.main;
    return (
      customLocation.description[key].detail ||
      (Object.entries(customLocation.description).find(
        ([_key, value]) => value.isFilter,
      ) || [])[0]
    );
  },
  value => value,
);

const FASTA_CLEANER = /(^[>;].*$)|\W/gm;

class IPScanResult extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }),
    matched: T.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { localIDForLocalPayload: null, localPayload: null };
  }

  #getLocalDataIfNeeded = () => {
    const { localID } = this.props;
    if (
      !localID ||
      this.props.data.payload ||
      this.state.localIDForLocalPayload === localID
    ) {
      return;
    }
    this.setState({ localIDForLocalPayload: localID }, async () => {
      const dataT = await getTableAccess(IPScanJobsData);
      const data = await dataT.get(localID);
      this.setState({
        localPayload: {
          sequence: data.input.replace(FASTA_CLEANER, '').toUpperCase(),
          matches: [],
          xref: [
            { name: 'Results are being processed on the InterProScan server' },
          ],
        },
      });
    });
  };

  componentDidMount() {
    this.#getLocalDataIfNeeded();
  }

  componentDidUpdate() {
    this.#getLocalDataIfNeeded();
  }

  render() {
    const { data: { loading, payload } = {}, matched } = this.props;

    let entries = NaN;
    if (payload && payload.results) {
      entries =
        payload.results[0].matches.length +
        new Set(
          payload.results[0].matches.map(
            m => (m.signature.entry || {}).accession,
          ),
        ).size;
    }

    return (
      <>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <BrowseTabsWithoutData
                key="browse"
                mainType="sequence"
                mainDB=""
                mainAccession={matched}
                data={{
                  loading: false,
                  payload: { metadata: { counters: { entries } } },
                }}
              />
            </div>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            {...this.props}
            localPayload={this.state.localPayload}
            locationSelector={locationSelector}
            indexRoute={SummaryAsync}
            childRoutes={subPagesForSequence}
          />
        </ErrorBoundary>
      </>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.jobs,
  state => state.settings.ipScan,
  state => state.customLocation.description.job.accession,
  (jobs, { protocol, hostname, port, root }, accession) => {
    if (!jobs) return;
    const job = Object.values(jobs).find(
      job =>
        job.metadata.localID === accession ||
        job.metadata.remoteID === accession,
    );
    if (!job || job.metadata.status !== 'finished') return;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}/result/${accession}/json`,
    });
  },
);

const mapStateToProps = createSelector(
  state => state.jobs || {},
  state => state.customLocation.description.job.accession,
  (jobs, accession) => {
    const job = Object.values(jobs).find(
      job =>
        job.metadata.localID === accession ||
        job.metadata.remoteID === accession,
    );
    return { localID: job.metadata.localID };
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  IPScanResult,
);
