import React, { PureComponent } from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { updateJobStatus } from 'actions/creators';
import Title from 'components/Title';
import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import loadable from 'higherOrder/loadable';

import getTableAccess, { IPScanJobsData, IPScanJobsMeta } from 'storage/idb';

import cssBinder from 'styles/cssBinder';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, pageStyle, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ipscan-summary" */ 'components/IPScan/Summary'
    ),
  loading: false,
});

const EntrySubPage = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'
    ),
  loading: false,
});

const SequenceSubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-subpage" */ 'subPages/Sequence'),
  loading: false,
});

const subPagesForSequence = new Map([
  ['entry', EntrySubPage],
  ['sequence', SequenceSubPage],
]);

const locationSelector = (customLocation: InterProLocation) => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key as Endpoint].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => (value as EndpointLocation).isFilter,
    ) || [])[0]
  );
};
export const countInterProFromMatches = (matches: Array<Iprscan5Match>) =>
  Array.from(
    new Set(matches.map((m) => (m.signature.entry || {}).accession)).values(),
  ).filter(Boolean).length;

const FASTA_CLEANER = /(^[>;].*$)|\W/gm;

type Props = {
  matched: string;
  jobAccession: string;
  sequenceAccession: string;
  localID?: string;
  orf?: number;
  remoteID?: string;
  entryDB?: string;
  localTitle?: string | null;
  entries?: number;
  updateJobStatus: typeof updateJobStatus;
};

type State = {
  localIDForLocalPayload: string | null;
  remoteIDForLocalPayload: string | null | undefined;
  localPayload: LocalPayload | null;
};
class IPScanResult extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      localIDForLocalPayload: null,
      remoteIDForLocalPayload: null,
      localPayload: null,
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
        const data = (await dataT.get(this.props.sequenceAccession)) as
          | IprscanDataIDB
          | IprscanNucleotideDataIDB;
        const metaTA = await getTableAccess(IPScanJobsMeta);
        const meta = await metaTA.get(localID);

        this.setState({
          remoteIDForLocalPayload: data?.results ? remoteID : null,
          localPayload: {
            sequence: (data?.input || data?.results?.[0]?.sequence || '')
              .replace(FASTA_CLEANER, '')
              .toUpperCase(),
            matches: data?.results?.[0]?.matches || [],
            'interpro-version': data?.['interpro-version'],
            xref: data?.results?.[0]?.xref || [
              {
                name:
                  meta?.status === 'error'
                    ? 'There was an error recovering this job from the server.'
                    : 'Results are being processed on the InterProScan server',
                id: '',
              },
            ],
            applications: data?.applications,
            md5: '',
            openReadingFrames:
              (data as IprscanNucleotideDataIDB).results?.[0]
                ?.openReadingFrames || [],
            crossReferences:
              (data as IprscanNucleotideDataIDB).results?.[0]
                ?.crossReferences || [],
          } as LocalPayload,
        });
      },
    );
  };

  render() {
    const { matched, jobAccession, orf } = this.props;

    let entries = (this.state.localPayload as Iprscan5Result)?.matches
      ? countInterProFromMatches(
          (this.state.localPayload as Iprscan5Result).matches,
        )
      : NaN;
    if (
      typeof orf === 'number' &&
      (this.state.localPayload as Iprscan5NucleotideResult)?.openReadingFrames
    ) {
      entries = countInterProFromMatches(
        (this.state.localPayload as Iprscan5NucleotideResult)
          ?.openReadingFrames[orf].protein.matches,
      );
    }
    const metadata: Metadata & { name: NameObject } = {
      accession: jobAccession,
      counters: {
        entries,
      },
      name: {
        name: 'InterProScan Search Result',
      },
      source_database: 'InterProScan',
      description: ['Placeholder for InterProScan results'],
    };
    return (
      <>
        <ErrorBoundary>
          <div className={css('vf-stack', 'vf-stack-400')}>
            {
              // Menu Just for InterProScan search
            }
            <Title metadata={metadata} mainType="protein" />

            <BrowseTabsWithoutData
              key="browse"
              mainType="sequence"
              mainDB=""
              mainAccession={matched}
              metadata={metadata}
            />
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            data={{ payload: null }}
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.jobs || {},
  (state: GlobalState) => state.customLocation.description.result.job as string,
  (state: GlobalState) =>
    state.customLocation.description.result.accession as string,
  (state: GlobalState) => state.customLocation.description.entry,
  (state: GlobalState) => state.customLocation.search.orf,
  (jobs, JobAccession, sequenceAccession, { isFilter, db }, orf) => {
    const job = Object.values(jobs).find(
      (job) =>
        job.metadata.localID === JobAccession ||
        job.metadata.remoteID === JobAccession,
    );

    return job
      ? {
          localID: job.metadata.localID,
          remoteID: job.metadata.remoteID,
          entryDB: (isFilter && db) || undefined,
          localTitle: job.metadata.localTitle,
          entries: job.metadata.entries,
          JobAccession,
          sequenceAccession,
          orf: typeof orf !== 'undefined' ? Number(orf) : undefined,
        }
      : { JobAccession, sequenceAccession };
  },
);

export default connect(mapStateToProps, { updateJobStatus })(IPScanResult);
