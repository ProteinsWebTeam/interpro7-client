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

import getTableAccess, { IPScanJobsData, IPScanJobsMeta } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import { iproscan2urlDB } from 'utils/url-patterns';
import ResultImporter from 'components/IPScan/ResultImporter';

const f = foundationPartial(fonts, pageStyle, ipro, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ipscan-summary" */ 'components/IPScan/Summary'
    ),
});

const EntrySubPage = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'
    ),
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
  (customLocation) => {
    const { key } = customLocation.description.main;
    return (
      customLocation.description[key].detail ||
      (Object.entries(customLocation.description).find(
        ([_key, value]) => value.isFilter,
      ) || [])[0]
    );
  },
  (value) => value,
);
export const countInterProFromMatches = (matches) =>
  Array.from(
    new Set(matches.map((m) => (m.signature.entry || {}).accession)).values(),
  ).filter(Boolean).length;

const countInterPro = createSelector(
  (payload) => payload.results[0].matches,
  countInterProFromMatches,
);
const countLibraries = createSelector(
  (payload) => payload.results[0].matches,
  (matches) =>
    matches.reduce((agg, m) => {
      const lib = iproscan2urlDB(m.signature.signatureLibraryRelease.library);
      if (!agg[lib]) agg[lib] = new Set();
      agg[lib].add(m.signature.accession);
      return agg;
    }, {}),
);

const FASTA_CLEANER = /(^[>;].*$)|\W/gm;
/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
  },
  matched: string,
  entryDB: string,
  localID: string,
  localTitle: string,
};*/

/*:: type State = {
  localIDForLocalPayload: ?string,
  localPayload: ?Object,
};*/
class IPScanResult extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }),
    matched: T.string.isRequired,
    entryDB: T.string,
    localID: T.string,
    job: T.object,
    localTitle: T.string,
    entries: T.number,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      localIDForLocalPayload: null,
      localPayload: null,
      shouldImportResults: false,
      isImporting: false,
    };
  }

  componentDidMount() {
    this.#getLocalDataIfNeeded();
  }

  componentDidUpdate() {
    this.#getLocalDataIfNeeded();
  }

  #getLocalDataIfNeeded = () => {
    const { localID, job } = this.props;
    if (!localID && !job && !this.state.isImporting) {
      this.setState({ shouldImportResults: true, isImporting: true });
      return;
    }
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
      const metaTA = await getTableAccess(IPScanJobsMeta);
      const meta = await metaTA.get(localID);

      this.setState({
        localPayload: {
          sequence: (data?.input || data?.results?.[0]?.sequence || '')
            .replace(FASTA_CLEANER, '')
            .toUpperCase(),
          matches: data?.results?.[0]?.matches || [],
          'interproscan-version': data?.['interproscan-version'],
          xref: [
            {
              name:
                meta.status === 'error'
                  ? 'There was an error recovering this job from the server.'
                  : 'Results are being processed on the InterProScan server',
            },
          ],
          group: meta?.group,
          orf: data?.results?.[0]?.orf,
          applications: data?.applications,
          goterms: data?.goterms,
          pathways: data?.pathways,
        },
      });
    });
  };

  render() {
    const {
      data: { payload } = {},
      matched,
      entryDB,
      localTitle,
      entries: entriesFromIDB,
    } = this.props;

    let entries = NaN;
    if (payload && payload.results) {
      if (!entryDB || entryDB.toLowerCase() === 'interpro') {
        entries = countInterPro(payload);
      } else {
        const dbEntries = countLibraries(payload);
        entries = dbEntries[entryDB].size;
      }
    }
    if (!entries && entriesFromIDB) entries = entriesFromIDB;

    return (
      <>
        <ResultImporter
          shouldImport={this.state.shouldImportResults}
          handleImported={() => this.setState({ shouldImportResults: false })}
        />
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
            </div>
          </div>
        </ErrorBoundary>
        {!this.state.shouldImportResults && (
          <ErrorBoundary>
            <Switch
              {...this.props}
              localPayload={this.state.localPayload}
              localTitle={localTitle}
              locationSelector={locationSelector}
              indexRoute={SummaryAsync}
              childRoutes={subPagesForSequence}
            />
          </ErrorBoundary>
        )}
      </>
    );
  }
}

const mapStateToUrl = createSelector(
  (state) => state.jobs,
  (state) => state.settings.ipScan,
  (state) => state.customLocation.description.result.accession,
  (jobs, { protocol, hostname, port, root }, accession) => {
    if (!jobs) return;
    const job = Object.values(jobs).find(
      (job) =>
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
  (state) => state.jobs || {},
  (state) => state.customLocation.description.result.accession,
  (state) => state.customLocation.description.entry,
  (jobs, accession, { isFilter, db }) => {
    const job = Object.values(jobs).find(
      (job) =>
        job.metadata.localID === accession ||
        job.metadata.remoteID === accession,
    );

    return job
      ? {
          localID: job.metadata.localID,
          entryDB: isFilter && db,
          localTitle: job.metadata.localTitle,
          entries: job.metadata.entries,
        }
      : null;
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  IPScanResult,
);
