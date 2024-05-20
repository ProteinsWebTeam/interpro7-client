import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format as formatTime } from 'timeago.js';

import Link from 'components/generic/Link';

import { filterSubset, sortSubsetBy } from 'components/Table/FullyLoadedTable';
import Table, { Column, ExtraOptions } from 'components/Table';
// $FlowFixMe
import TimeAgo from 'components/TimeAgo';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import RefreshButton from 'components/IPScan/RefreshButton';
import ClearAllDialog from 'components/IPScan/ClearAllDialog';
import ImportResultSearch from 'components/IPScan/ImportResultSearch';
import Actions from 'components/IPScan/Actions';
import GroupActions from 'components/IPScan/Actions/Group';
// $FlowFixMe
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Button from 'components/SimpleCommonComponents/Button';
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import config from 'config';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(interproTheme, fonts, ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const getIProScanURL = (accession /*: string*/) => {
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

/*:: type Props = {
  jobs: Array<Object>,
  search: {
    page: number,
    page_size: number
   },
  defaultPageSize: number,
  updateJobStatus: function,
}*/

export class IPScanStatus extends PureComponent /*:: <Props> */ {
  static propTypes = {
    jobs: T.arrayOf(T.object).isRequired,
    search: T.shape({
      page: T.number,
      page_size: T.number,
    }).isRequired,
    defaultPageSize: T.number.isRequired,
    updateJobStatus: T.func.isRequired,
  };
  state = { show: false, jobsToRemove: null, from: null };

  deleteAll = (from = 'file') => {
    const { jobs } = this.props;
    this.setState({
      show: true,
      from,
      jobsToRemove: jobs.filter(
        (job) =>
          (from === 'file' && job.status === 'imported file') ||
          (from === 'server' && job.remoteID.startsWith('iprscan5')),
      ),
    });
  };

  render() {
    const { jobs, search, defaultPageSize } = this.props;
    const keys = ['localID', 'localTitle', 'times'];
    let paginatedJobs = [...jobs];
    sortSubsetBy(paginatedJobs, search, keys, {
      localID: (localID, row) => row.remoteID || localID,
      times: ({ created, importing, lastUpdate }) =>
        new Date(created || importing || lastUpdate),
    });
    paginatedJobs = filterSubset(paginatedJobs, search, keys, {
      localID: (localID, row) => row.remoteID || localID,
      times: ({ created, importing, lastUpdate }) =>
        formatTime(new Date(created || importing || lastUpdate)),
    });
    paginatedJobs.sort((a, b) => {
      if (!a.group) return -1;
      if (!b.group) return 1;
      if (a.group === b.group) return 0;
      return a.group > b.group ? 1 : -1;
    });
    const pageSize = search.page_size || defaultPageSize;
    paginatedJobs = paginatedJobs.splice(
      ((search.page || 1) - 1) * pageSize,
      pageSize,
    );
    return (
      <div className={f('row', 'columns')}>
        <h3 className={f('light')}>
          Your InterProScan Search Results{' '}
          <TooltipAndRTDLink rtdPage="searchways.html#sequence-search-results" />
        </h3>
        <p className={f('info')}>
          Your InterProScan search results are shown below. Searches may take
          varying times to complete. You can navigate to other pages and once
          the search is finished, you will receive a notification. The results
          will be available for 7 days.
        </p>
        <p className={f('info')}>
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
        <div className={f('button-bar')}>
          <div className={f('button-group')}>
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
          shouldGroup={true}
          // eslint-disable-next-line react/display-name
          groupActions={GroupActions}
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
            renderer={(localTitle /*: string */, row /*: Object */) => (
              <>
                <span style={{ marginRight: '1em' }}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'result' },
                        result: {
                          type: 'InterProScan',
                          accession: row.remoteID || row.localID,
                        },
                      },
                    }}
                  >
                    {(localTitle === '∅' ? null : localTitle) ||
                      row.remoteID ||
                      row.localID}
                  </Link>
                </span>
                {row.remoteID && !row.remoteID.startsWith('imported') && (
                  <CopyToClipboard
                    textToCopy={getIProScanURL(row.remoteID)}
                    tooltipText="Copy URL"
                  />
                )}
              </>
            )}
          >
            Results
          </Column>
          <Column
            dataKey="times"
            isSearchable={true}
            renderer={(
              {
                created,
                importing,
                lastUpdate,
              } /*: {created: string, importing: string, lastUpdate: string} */,
            ) => {
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
            headerClassName={f('table-center')}
            cellClassName={f('table-center')}
            renderer={(status /*: string */, row /*: Object */) => (
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
                    className={f('icon', 'icon-common', 'ico-notfound')}
                    data-icon="&#x78;"
                    aria-label="Job failed or not found"
                  />
                ) : null}
                {['finished', 'imported file', 'saved in browser'].includes(
                  status,
                ) && (
                  <Link
                    to={{
                      description: {
                        main: { key: 'result' },
                        result: {
                          type: 'InterProScan',
                          accession: row.remoteID,
                        },
                      },
                    }}
                  >
                    <span
                      style={{ fontSize: '160%' }}
                      className={f(
                        'icon',
                        'icon-common',
                        status === 'finished'
                          ? 'ico-confirmed'
                          : 'icon-reviewed-data',
                      )}
                      data-icon="&#xf00c;"
                      aria-label="Job ready"
                    />
                  </Link>
                )}
              </Tooltip>
            )}
          >
            Status
          </Column>
          <Column
            dataKey="localID"
            defaultKey="actions"
            headerClassName={f('table-center')}
            cellClassName={f('table-center', 'font-ml')}
            renderer={(localID /*: string */) => (
              <Actions localID={localID} forStatus={true} />
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

const compare = (a, b) => {
  if (b.remoteID) return b.remoteID > a.remoteID ? 1 : -1;
  return 1;
};

const mapsStateToProps = createSelector(
  (state) =>
    Object.values(state.jobs || {})
      .map((j) => j.metadata)
      .sort(
        compare,
        // (b.remoteID || b.localID) > (a.remoteID || a.localID) ? 1 : -1,
      ),
  (state) => state.customLocation.search,
  (state) => state.settings.navigation.pageSize,
  (jobs, search, defaultPageSize) => ({
    jobs,
    search,
    defaultPageSize,
  }),
);

export default connect(mapsStateToProps, { updateJobStatus })(IPScanStatus);
