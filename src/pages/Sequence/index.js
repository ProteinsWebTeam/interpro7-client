import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

// import { EntryMenuWithoutData } from 'components/EntryMenu';
import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import loadable from 'higherOrder/loadable';

import getTableAccess, { IPScanJobsData } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import { iproscan2urlDB } from 'utils/url-patterns';

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
const countInterPro = createSelector(
  payload => payload.results[0].matches,
  matches =>
    Array.from(
      new Set(matches.map(m => (m.signature.entry || {}).accession)).values(),
    ).filter(Boolean).length,
);
const countLibraries = createSelector(
  payload => payload.results[0].matches,
  matches =>
    matches.reduce((agg, m) => {
      const lib = iproscan2urlDB(m.signature.signatureLibraryRelease.library);
      if (!agg[lib]) agg[lib] = new Set();
      agg[lib].add(m.signature.accession);
      return agg;
    }, {}),
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
    entryDB: T.string,
  };

  constructor(props) {
    super(props);

    this.state = { localIDForLocalPayload: null, localPayload: null };
  }

  componentDidMount() {
    this.#getLocalDataIfNeeded();
  }

  componentDidUpdate() {
    this.#getLocalDataIfNeeded();
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

  render() {
    const { data: { payload } = {}, matched, entryDB } = this.props;

    let entries = NaN;
    if (payload && payload.results) {
      if (!entryDB || entryDB.toLowerCase() === 'interpro') {
        entries = countInterPro(payload);
      } else {
        const dbEntries = countLibraries(payload);
        entries = dbEntries[entryDB].size;
      }
    }

    return (
      <>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              {
                // Menu Just for InterProScan search
              }

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
              {
                // <EntryMenuWithoutData
                //   data={{
                //   loading: false}}
                //   metadata={{ counters: { entries }}}
                //   key="browseplus"
                //   mainType="sequence"
                //   mainDB=""
                //   mainAccession={matched}
                //   lowGraphics={false}
                //   isSignature={false}
                // />
              }
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
  state => state.customLocation.description.result.accession,
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
  state => state.customLocation.description.result.accession,
  state => state.customLocation.description.entry,
  (jobs, accession, { isFilter, db }) => {
    const job = Object.values(jobs).find(
      job =>
        job.metadata.localID === accession ||
        job.metadata.remoteID === accession,
    );
    return { localID: job.metadata.localID, entryDB: isFilter && db };
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  IPScanResult,
);
