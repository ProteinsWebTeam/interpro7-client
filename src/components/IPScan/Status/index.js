import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column } from 'components/Table';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import RefreshButton from 'components/IPScan/RefreshButton';
import ImportResultSearch from 'components/IPScan/ImportResultSearch';
import Actions from 'components/IPScan/Actions';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
import CopyToClipboard from 'components/SimpleCommonComponents/CopyToClipboard';

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
import SpinningCircle from 'components/SimpleCommonComponents/Loading/spinningCircle';

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
    className={f('button')}
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

  render() {
    const { jobs, search, defaultPageSize } = this.props;
    const pageSize = search.page_size || defaultPageSize;
    const paginatedJobs = [...jobs].splice(
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
          Your InterProScan search results are listed below. Each search may run
          for different time. You can navigate to other pages if you prefer.
          Once the job is finished, you will be notified and the results will be
          available for 7 days.
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
        >
          <Column
            dataKey="localID"
            renderer={(localID /*: string */, row /*: Object */) => (
              <>
                <Link
                  to={{
                    description: {
                      main: { key: 'result' },
                      result: {
                        type: 'InterProScan',
                        accession: row.remoteID || localID,
                      },
                    },
                  }}
                >
                  {row.remoteID || localID}{' '}
                </Link>
                {row.remoteID && (
                  <CopyToClipboard
                    textToCopy={getIProScanURL(row.remoteID)}
                    tooltipText="CopyURL"
                  />
                )}
              </>
            )}
          >
            Results
          </Column>
          <Column dataKey="localTitle">Name</Column>
          <Column
            dataKey="times"
            renderer={(
              {
                created,
                importing,
              } /*: {created: string, importing: string} */,
            ) => {
              const parsed = new Date(created || importing);
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
                {status === 'finished' && (
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
                      className={f('icon', 'icon-common', 'ico-confirmed')}
                      data-icon="&#xf00c;"
                      aria-label="Job finished"
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
            renderer={(localID /*: string */) => <Actions localID={localID} />}
          >
            Action
          </Column>
        </Table>
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
