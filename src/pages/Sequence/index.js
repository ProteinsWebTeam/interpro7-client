// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

// $FlowFixMe
import Title from 'components/Title';
import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';
import Redirect from 'components/generic/Redirect';

import loadable from 'higherOrder/loadable';

import getTableAccess, { IPScanJobsData, IPScanJobsMeta } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import ResultImporter from 'components/IPScan/ResultImporter';
import { updateJobStatus } from 'actions/creators';

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

const locationSelector = (customLocation) => {
  const { key } = customLocation.description.main;
  return (
    // prettier-ignore
    customLocation.description[key].detail ||
      ((Object.entries(customLocation.description)/*: any */).find(
        ([_key, value]/*: [string, {isFilter: boolean}] */) => value.isFilter,
      ) || [])[0]
  );
};
export const countInterProFromMatches = (matches) =>
  Array.from(
    new Set(matches.map((m) => (m.signature.entry || {}).accession)).values(),
  ).filter(Boolean).length;

const FASTA_CLEANER = /(^[>;].*$)|\W/gm;
/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
  },
  matched: string,
  entryDB: string,
  entries: number,
  accession: string,
  localID: string,
  remoteID: string,
  localTitle: string,
  updateJobStatus: ()=>void,
};*/

/*:: type State = {
  localIDForLocalPayload: ?string,
  remoteIDForLocalPayload: ?string,
  localPayload: ?Object,
  isImporting: boolean,
  shouldImportResults: boolean,
};*/
class IPScanResult extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    matched: T.string.isRequired,
    accession: T.string,
    entryDB: T.string,
    localID: T.string,
    remoteID: T.string,
    localTitle: T.string,
    entries: T.number,
    updateJobStatus: T.func.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      localIDForLocalPayload: null,
      remoteIDForLocalPayload: null,
      localPayload: null,
      shouldImportResults: false,
      isImporting: false,
    };
  }

  componentDidMount() {
    this.#getLocalDataIfNeeded();
    this.props.updateJobStatus();
  }

  componentDidUpdate() {
    this.#getLocalDataIfNeeded();
    this.props.updateJobStatus();
  }

  #getLocalDataIfNeeded = () => {
    const { localID, remoteID } = this.props;
    if (!localID && !this.state.isImporting) {
      this.setState({ shouldImportResults: true, isImporting: true });
      return;
    }
    if (
      !localID ||
      (this.state.localIDForLocalPayload === localID &&
        this.state.remoteIDForLocalPayload === remoteID)
    ) {
      return;
    }
    this.setState(
      { localIDForLocalPayload: localID, remoteIDForLocalPayload: remoteID },
      async () => {
        const dataT = await getTableAccess(IPScanJobsData);
        const data = await dataT.get(localID);
        const metaTA = await getTableAccess(IPScanJobsMeta);
        const meta = await metaTA.get(localID);

        this.setState({
          remoteIDForLocalPayload: data?.results ? remoteID : null,
          localPayload: {
            sequence: (data?.input || data?.results?.[0]?.sequence || '')
              .replace(FASTA_CLEANER, '')
              .toUpperCase(),
            matches: data?.results?.[0]?.matches || [],
            'interproscan-version': data?.['interproscan-version'],
            xref: [
              {
                name:
                  meta?.status === 'error'
                    ? 'There was an error recovering this job from the server.'
                    : 'Results are being processed on the InterProScan server',
              },
            ],
            group: meta?.group,
            orf: data?.results?.[0]?.orf,
            applications: data?.applications,
          },
        });
      },
    );
  };

  render() {
    const {
      matched,
      localTitle,
      entries: entriesProps,
      remoteID,
      accession,
    } = this.props;

    let entries = entriesProps || NaN;
    if (this.state.localPayload && isNaN(entries)) {
      entries = countInterProFromMatches(this.state.localPayload.matches);
    }

    if (remoteID && remoteID !== accession) {
      return (
        <Redirect
          to={{
            description: {
              main: { key: 'result' },
              result: {
                type: 'InterProScan',
                accession: remoteID,
              },
            },
          }}
        />
      );
    }
    const metadata = {
      accession,
      counters: { entries },
      name: {
        name: 'InterProScan Search Result',
      },
    };
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
              <Title metadata={metadata} mainType="protein" />

              <BrowseTabsWithoutData
                key="browse"
                mainType="sequence"
                mainDB=""
                mainAccession={matched}
                data={{
                  loading: false,
                  payload: { metadata },
                }}
              />
            </div>
          </div>
        </ErrorBoundary>
        {!this.state.shouldImportResults && (
          <ErrorBoundary>
            <Switch
              data={{ payload: null }}
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

const mapStateToProps = createSelector(
  (state) => state.jobs || {},
  (state) => state.customLocation.description.result.accession,
  (state) => state.customLocation.description.entry,
  (jobs, accession, { isFilter, db }) => {
    const job /*: {metadata: {localID: string, remoteID: string, localTitle: string, entries: number}} */ =
      // prettier-ignore
      (Object.values(jobs)/*: any */).find(
      (job) =>
        job.metadata.localID === accession ||
        job.metadata.remoteID === accession ||
        job.metadata.localID === `${accession}-1` ||
        job.metadata.remoteID === `${accession}-1`,
    );

    return job
      ? {
          localID: job.metadata.localID,
          remoteID: job.metadata.remoteID,
          entryDB: isFilter && db,
          localTitle: job.metadata.localTitle,
          entries: job.metadata.entries,
          accession,
        }
      : { accession };
  },
);

export default connect(mapStateToProps, { updateJobStatus })(IPScanResult);
