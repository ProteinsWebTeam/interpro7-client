import React, { PureComponent } from 'react';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { updateJobStatus } from 'actions/creators';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format as formatTime } from 'timeago.js';

import Link from 'components/generic/Link';

import { filterSubset, sortSubsetBy } from 'components/Table/FullyLoadedTable';
import Table, { Column, ExtraOptions } from 'components/Table';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Button from 'components/SimpleCommonComponents/Button';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';

import RefreshButton from 'components/IPScan/RefreshButton';
import ClearAllDialog, {
  SourceToRemove,
} from 'components/IPScan/ClearAllDialog';
import ImportResultSearch from 'components/IPScan/ImportResultSearch';
import Actions from 'components/IPScan/Actions';

import config from 'config';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import tableStyles from 'components/Table/style.css';

const css = cssBinder(fonts, local, tableStyles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const getIProScanURL = (accession: string) => {
  const { protocol, hostname, port, pathname } = config.root.website;
  const url = format({
    protocol,
    hostname,
    port,
    pathname:
      pathname +
      descriptionToPath({
        main: { key: 'result' },
        result: { type: 'InterProScan', accession },
      }),
  });

  return url;
};

const GoToNewSearch = () => (
  <Link
    to={{
      description: {
        main: { key: 'search' },
        search: { type: 'sequence' },
      },
    }}
    buttonType="primary"
  >
    Submit a new search
  </Link>
);

type Props = {
  jobs: Array<MinimalJobMetadata>;
  search: InterProLocationSearch;
  defaultPageSize: number;
  updateJobStatus: typeof updateJobStatus;
};

type State = {
  show: boolean;
  jobsToRemove: Array<MinimalJobMetadata>;
  from: SourceToRemove;
};

export class IPScanStatus extends PureComponent<Props, State> {
  state: State = { show: false, jobsToRemove: [], from: null };

  deleteAll = (from: SourceToRemove = 'file') => {
    const { jobs } = this.props;
    this.setState({
      show: true,
      from,
      jobsToRemove: jobs.filter(
        (job) =>
          (from === 'file' && job.status === 'imported file') ||
          (from === 'server' && (job.remoteID || '').startsWith('iprscan5')),
      ),
    });
  };

  render() {
    const { jobs, search, defaultPageSize } = this.props;
    const keys = ['localID', 'localTitle', 'times', 'entries'];
    let paginatedJobs = [...jobs];
    sortSubsetBy<MinimalJobMetadata>(paginatedJobs, search, keys, {
      localID: (localID, row) => row!.remoteID || (localID as string),
      localTitle: (localTitle, row) =>
        (localTitle as string) || row?.remoteID || row?.localID || '',
      times: (times) => {
        const { created, importing, lastUpdate } = times as JobTimes;
        return new Date(
          (created || importing || lastUpdate) as number,
        ).toISOString();
      },
    });
    paginatedJobs = filterSubset(paginatedJobs, search, keys, {
      localID: (localID, row) => row!.remoteID || (localID as string),
      localTitle: (localTitle, row) =>
        (localTitle as string) || row?.remoteID || row?.localID || '',
      times: (times) => {
        const { created, importing, lastUpdate } = times as JobTimes;
        return formatTime(new Date(created || importing || lastUpdate));
      },
    });
    const pageSize = search.page_size || defaultPageSize;
    paginatedJobs = paginatedJobs.splice(
      ((Number(search.page) || 1) - 1) * Number(pageSize),
      Number(pageSize),
    );

    const statusColumnName: Record<string, string> = {
      'imported file': 'Imported',
      'finished': 'Completed',
      'saved in browser': 'Saved',
    };

    return (
      <div className={css('vf-stack')}>
        <h3 className={css('light')}>
          Your InterProScan Search Results{' '}
          <TooltipAndRTDLink rtdPage="searchways.html#sequence-search-results" />
        </h3>
        <p className={css('info')}>
          Your InterProScan search results are shown below. Searches may take
          varying times to complete. You can navigate to other pages and once
          the search is finished, you will receive a notification. The results
          will be available for 7 days.
        </p>
        <p className={css('info')}>
          Alternatively, you can import the results of an InterProScan run (in
          JSON format) into this page in order to view your search results
          interactively.
        </p>
        <SchemaOrgData
          data={{
            name: 'Your InterProScan searches',
            description:
              'The status of all the requested InterProScan searches',
          }}
          processData={schemaProcessDataPageSection}
        />
        <div className={css('button-bar')}>
          <div className={css('button-group')}>
            <GoToNewSearch />
            <RefreshButton />
          </div>
          <ImportResultSearch />
        </div>
        <Table
          dataTable={paginatedJobs}
          rowKey="localID"
          contentType="result"
          actualSize={jobs.length}
          query={search}
          showTableIcon={false}
          // groupActions={GroupActions}
        >
          <ExtraOptions>
            <DropDownButton label="Clear All" icon="icon-trash">
              <ul>
                <li>
                  <Button type="hollow" onClick={() => this.deleteAll('file')}>
                    Loaded from File
                  </Button>
                </li>
                <li>
                  <Button
                    type="hollow"
                    onClick={() => this.deleteAll('server')}
                  >
                    Loaded from Servers
                  </Button>
                </li>
              </ul>
            </DropDownButton>
          </ExtraOptions>
          <Column
            dataKey="localTitle"
            isSearchable={true}
            isSortable={true}
            renderer={(localTitle: string, row: IprscanMetaIDB) => {
              // Handle prefixes
              let jobName =
                (localTitle === '∅' ? null : localTitle) ||
                row.remoteID ||
                row.localID;

              if (jobName?.includes('internal-')) {
                jobName = '∅';
              }

              jobName = jobName?.replace('imported_file-', '');

              return (
                <>
                  <span style={{ marginRight: '1em' }}>
                    {jobName !== '∅' ? (
                      <Link
                        to={{
                          description: {
                            main: { key: 'result' },
                            result: {
                              type: 'InterProScan',
                              job: row.remoteID || row.localID,
                            },
                          },
                        }}
                      >
                        {jobName}
                      </Link>
                    ) : (
                      jobName
                    )}
                  </span>
                  {row.remoteID && !row.remoteID.startsWith('imported') && (
                    <CopyToClipboard
                      textToCopy={getIProScanURL(row.remoteID)}
                      tooltipText="Copy URL"
                    />
                  )}
                </>
              );
            }}
          >
            Results
          </Column>
          <Column dataKey="entries" isSearchable={true} isSortable={true}>
            Sequences
          </Column>
          <Column
            dataKey="times"
            isSearchable={true}
            isSortable={true}
            renderer={({ created, importing, lastUpdate }: JobTimes) => {
              const parsed = new Date(created || importing || lastUpdate);
              return (
                <Tooltip
                  title={`${
                    created ? 'Created' : 'Imported'
                  } on ${parsed.toLocaleDateString()} at ${parsed.toLocaleTimeString()}`}
                >
                  <TimeAgo date={parsed} noTitle />
                </Tooltip>
              );
            }}
          >
            Created
          </Column>
          <Column
            dataKey="status"
            headerClassName={css('table-header-center')}
            cellClassName={css('table-center')}
            renderer={(status: string, row: IprscanMetaIDB) => (
              <Tooltip title={`Job ${status}`}>
                {(status === 'running' ||
                  status === 'created' ||
                  status === 'queued' ||
                  status === 'submitted') && (
                  <div>
                    <SpinningCircle />
                    <div>Searching</div>
                  </div>
                )}

                {status === 'not found' ||
                status === 'failed' ||
                status === 'failure' ||
                status === 'error' ? (
                  <span
                    style={{ fontSize: '160%' }}
                    className={css('icon', 'icon-common', 'ico-notfound')}
                    data-icon="&#x78;"
                    aria-label="Job failed or not found"
                  />
                ) : null}
                {['finished', 'imported file', 'saved in browser'].includes(
                  status,
                ) &&
                  (statusColumnName[status] ||
                    status[0].toUpperCase() + status.slice(1))}
              </Tooltip>
            )}
          >
            Status
          </Column>
          <Column
            dataKey="localID"
            defaultKey="actions"
            headerClassName={css('table-header-center')}
            cellClassName={css('table-center', 'font-ml')}
            renderer={(localID: string, row: IprscanMetaIDB) => (
              <Actions localID={localID} forStatus={true} status={row.status} />
            )}
          >
            Action
          </Column>
        </Table>
        <ClearAllDialog
          show={this.state.show}
          closeModal={() => this.setState({ show: false })}
          jobs={this.state.jobsToRemove}
          from={this.state.from}
        />
      </div>
    );
  }
}

const compare = (a: MinimalJobMetadata, b: MinimalJobMetadata) => {
  if (b.remoteID && a.remoteID) return b.remoteID > a.remoteID ? 1 : -1;
  return 1;
};

const mapsStateToProps = createSelector(
  (state: GlobalState) =>
    Object.values(state.jobs || {})
      .map((j) => j.metadata)
      .sort(compare),
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.navigation.pageSize,
  (jobs, search, defaultPageSize) => ({
    jobs,
    search,
    defaultPageSize,
  }),
);

export default connect(mapsStateToProps, { updateJobStatus })(IPScanStatus);
