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

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { updateJobStatus, addToast, changeSettingsRaw } from 'actions/creators';

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
  showIPScanJobToast: boolean,
  addToast: function,
  changeSettingsRaw: function,
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
    showIPScanJobToast: T.bool.isRequired,
    addToast: T.func.isRequired,
    changeSettingsRaw: T.func.isRequired,
  };

  componentDidMount() {
    this.props.updateJobStatus();
    if (this.props.showIPScanJobToast) {
      this.props.addToast(
        {
          title: '💡 Tip',
          body: 'To view the results, click on the Job ID',
          checkBox: {
            label: 'Do not show again',
            fn: () => this.updateToastSettings(this.props),
          },
          ttl: 5000,
        },
        'IPScanJob',
      );
    }
  }

  updateToastSettings(props) {
    props.changeSettingsRaw('notifications', 'showIPScanJobToast', false);
  }

  render() {
    const { jobs, search, defaultPageSize } = this.props;
    const pageSize = search.page_size || defaultPageSize;
    const paginatedJobs = [...jobs].splice(
      ((search.page || 1) - 1) * pageSize,
      pageSize,
    );
    return (
      <div className={f('row', 'columns')}>
        <h3 className={f('light')}>Your InterProScan searches</h3>
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
                <span
                  className={f('icon', 'icon-common')}
                  data-icon="&#xf0c1;"
                />{' '}
                {row.remoteID || localID}
              </Link>
            )}
          >
            Job ID
          </Column>
          <Column dataKey="localTitle">Title</Column>
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
            renderer={(status /*: string */) => (
              <Tooltip title={`Job ${status}`}>
                {(status === 'running' ||
                  status === 'created' ||
                  status === 'submitted') && (
                  <span>In progress</span>
                  // <span
                  //   style={{ fontSize: '200%' }}
                  //   className={f('icon', 'icon-common', 'ico-neutral')}
                  //   data-icon="&#xf017;"
                  //   aria-label={`Job ${status}`}
                  // />
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
            renderer={(localID /*: string */, { remoteID }) => (
              <Actions localID={localID} remoteID={remoteID} />
            )}
          >
            Action
          </Column>
        </Table>
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
  state => state.settings.notifications.showIPScanJobToast,
  (jobs, search, defaultPageSize, showIPScanJobToast) => ({
    jobs,
    search,
    defaultPageSize,
    showIPScanJobToast,
  }),
);

export default connect(
  mapsStateToProps,
  { updateJobStatus, addToast, changeSettingsRaw },
)(IPScanStatus);
