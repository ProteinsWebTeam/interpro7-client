import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column } from 'components/Table';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import RefreshButton from 'components/IPScan/RefreshButton';
import Actions from 'components/IPScan/Actions';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(interproTheme, fonts, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

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

class IPScanStatus extends PureComponent {
  static propTypes = {
    jobs: T.arrayOf(T.object).isRequired,
    search: T.shape({
      page: T.number,
      page_size: T.number,
    }).isRequired,
    defaultPageSize: T.number.isRequired,
    updateJobStatus: T.func.isRequired,
  };

  componentDidMount() {
    this.props.updateJobStatus();
  }

  render() {
    const { jobs, search, defaultPageSize } = this.props;
    const pageSize = search.page_size || defaultPageSize;
    const paginatedJobs = [...jobs].splice(
      ((search.page || 1) - 1) * pageSize,
      pageSize,
    );
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <div className={f('row')}>
            <h3 className={f('large-9', 'columns', 'light')}>
              Your InterProScan searches
            </h3>
            <SchemaOrgData
              data={{
                name: 'Your InterProScan searches',
                description:
                  'The status of all the requested InterProScan searches',
              }}
              processData={schemaProcessDataPageSection}
            />

            <div className={f('button-group', 'columns', 'large-3')}>
              <GoToNewSearch />
              <RefreshButton />
            </div>
          </div>
          <Table
            dataTable={paginatedJobs}
            rowKey="localID"
            contentType="job"
            actualSize={jobs.length}
            query={search}
          >
            <Column
              dataKey="localID"
              renderer={(localID /*: string */, row /*: Object */) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'job' },
                      job: {
                        type: 'InterProScan',
                        accession: row.remoteID || localID,
                      },
                    },
                  }}
                >
                  {row.remoteID || localID}
                </Link>
              )}
            >
              Job ID
            </Column>
            <Column dataKey="localTitle">Title</Column>
            <Column
              dataKey="times.created"
              renderer={(created /*: string */) => {
                const parsed = new Date(created);
                return (
                  <Tooltip
                    title={`Created on ${parsed.toLocaleDateString()} at ${parsed.toLocaleTimeString()}`}
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
              renderer={(status /*: string */) => (
                <Tooltip title={`Job ${status}`}>
                  {(status === 'running' ||
                    status === 'created' ||
                    status === 'submitted') && (
                    <span
                      style={{ fontSize: '200%' }}
                      className={f('icon', 'icon-common', 'ico-neutral')}
                      data-icon="&#xf017;"
                      aria-label={`Job ${status}`}
                    />
                  )}

                  {status === 'not found' ||
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
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-common', 'ico-confirmed')}
                      data-icon="&#xf00c;"
                      aria-label="Job finished"
                    />
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
                <Actions localID={localID} />
              )}
            >
              Actions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const mapsStateToProps = createSelector(
  state =>
    Object.values(state.jobs || {})
      .map(j => j.metadata)
      .sort((a, b) => b.times.created - a.times.created),
  state => state.customLocation.search,
  state => state.settings.navigation.pageSize,
  (jobs, search, defaultPageSize) => ({ jobs, search, defaultPageSize }),
);

export default connect(
  mapsStateToProps,
  { updateJobStatus },
)(IPScanStatus);
