// @flow
import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column } from 'components/Table';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import url from 'url';
import TA from 'timeago.js';

import getTableAccess, { IPScanJobsMeta, IPScanJobsData } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
const f = foundationPartial(fonts, ipro);

let timeago;
const ONE_MINUTE = 60000;

const getDefinedjobs = state => Object.entries(state).filter(([, j]) => j);

class IPScanStatus extends Component {
  static defaultProps = {
    refreshRate: 2 * ONE_MINUTE,
  };

  static propTypes = {
    refreshRate: T.number,
    ipScan: T.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    // Promises to table accesses
    this._jobsTableAccess = getTableAccess(IPScanJobsMeta);
    this._blobsTableAccess = getTableAccess(IPScanJobsData);
    // Only create one instance, and only when it is needed
    if (!timeago) timeago = new TA();
    // Reference to timeout (to cancel it on unmount)
    this._timeout = null;
  }

  async componentWillMount() {
    await this._getAllJobs();
    this._checkAllUnfinishedJobs(true);
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _fetchStatus = async IPScanId => {
    const response = await fetch(
      url.resolve(
        url.format({ ...this.props.ipScan, pathname: this.props.ipScan.root }),
        `status/${IPScanId}`,
      ),
    );
    const rawStatus = await response.text();
    return rawStatus.toLowerCase().replace('_', ' ');
  };

  _getAllJobs = async () => {
    const jobsTableAccess = await this._jobsTableAccess;
    const jobs = await jobsTableAccess.getAll();
    this.setState(jobs);
  };

  _checkAllUnfinishedJobs = async recursive => {
    const finishedStates = ['finished', 'failure', 'not found'];
    await Promise.all(
      getDefinedjobs(this.state)
        .filter(([, { status }]) => !finishedStates.includes(status))
        .map(async ([internalId, job]) => {
          const { id, status } = job;
          let newStatus;
          try {
            // Get status from the API
            newStatus = await this._fetchStatus(id);
          } catch (err) {
            // Might be offline, of API might be down, just ignore
            return;
          }
          // If status didn't change, return
          if (status === newStatus) return;
          // Change job status in idb
          try {
            const jobsTA = await this._jobsTableAccess;
            jobsTA.update(+internalId, job => ({ ...job, status: newStatus }));
          } catch (err) {
            console.error(err);
          }
          // Change job status in state
          this.setState({ [internalId]: { ...job, status: newStatus } });
        }),
    );
    if (!recursive) return;
    // Schedule an other check later
    this._timeout = setTimeout(
      this._checkAllUnfinishedJobs,
      this.props.refreshRate,
    );
  };

  _handleSave = async ({ target: { dataset: { id } } }) => {
    console.log(`saving job with internal id ${id}`);
    console.warn('not implemented yet');
  };

  _handleDelete = async ({ target: { dataset: { id } } }) => {
    console.log(`deleting job with internal id ${id}`);
    // Separate job to be deleted from the others
    const removedJob = this.state[id];
    // Do clean-up in IDB, to both tables concurrently
    await Promise.all([
      this._jobsTableAccess.then(ta => ta.delete(+id)),
      this._blobsTableAccess.then(ta =>
        ta.delete(removedJob.input.sequenceBlobId),
      ),
    ]);
    this.setState({ [id]: null });
  };

  render() {
    const jobs = getDefinedjobs(this.state);
    if (!jobs.length) return null;
    jobs.sort(
      // Sort by creation time (newest first)
      ([, { times: { created: a } }], [, { times: { created: b } }]) => b - a,
    );
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h3>Your InterProScan searches</h3>
          {/* <button
            className={f('button', 'secondary')}
            onClick={this._checkAllUnfinishedJobs}
          >Refresh</button> */}
          <Table
            dataTable={jobs.map(([jobId, rest]) => ({ jobId, ...rest }))}
            actualSize={jobs.length}
          >
            <Column
              dataKey="jobId"
              renderer={(jobId /*: string */, row /*: Object */) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'job' },
                      job: {
                        type: 'InterProScan',
                        accession: row.id || jobId,
                      },
                    },
                  }}
                >
                  {row.id || jobId}
                </Link>
              )}
            >
              Job ID
            </Column>
            <Column
              dataKey="times.created"
              defaultKey="date"
              renderer={(created /*: string */) => (
                <Tooltip title={`Created ${timeago.format(created)}`}>
                  <time dateTime={new Date(created).toISOString()}>
                    {new Date(created).toLocaleString()}
                  </time>
                </Tooltip>
              )}
            >
              Date
            </Column>
            <Column
              dataKey="times.created"
              renderer={(
                created /*: string */,
                {
                  times: { lastUpdate },
                } /*: { times: { lastUpdate: string } } */,
              ) => (
                <Tooltip title={`Last modified ${timeago.format(lastUpdate)}`}>
                  <time dateTime={new Date(created).toISOString()}>
                    {timeago.format(lastUpdate)}
                  </time>
                </Tooltip>
              )}
            >
              Created
            </Column>
            <Column
              dataKey="status"
              cellClassName={f('table-center')}
              renderer={(status /*: string */) => (
                <Tooltip title={`Job ${status}`}>
                  {status === 'running' && (
                    <span
                      style={{ fontSize: '200%' }}
                      className={f('icon', 'icon-generic', 'ico-progress')}
                      data-icon="{"
                      aria-label="Job running"
                    />
                  )}

                  {status === 'not found' ||
                  status === 'failure' ||
                  status === 'error' ? (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-functional', 'ico-notfound')}
                      data-icon="x"
                      aria-label="Job failed or not found"
                    />
                  ) : null}
                  {status === 'finished' && (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-functional', 'ico-confirmed')}
                      data-icon="/"
                      aria-label="Job finished"
                    />
                  )}
                </Tooltip>
              )}
            >
              Status
            </Column>
            <Column
              dataKey="jobId"
              defaultKey="actions"
              renderer={(
                jobId /*: string */,
                { saved } /*: {saved: boolean } */,
              ) => (
                <React.Fragment>
                  <Tooltip title="Save job">
                    <button
                      className={f('button', saved ? 'warning' : 'secondary')}
                      type="button"
                      data-id={jobId}
                      onClick={this._handleSave}
                      aria-label="Save job"
                    >
                      ★
                    </button>
                  </Tooltip>
                  <Tooltip title="Delete job">
                    <button
                      className={f('button', 'alert')}
                      type="button"
                      data-id={jobId}
                      onClick={this._handleDelete}
                      aria-label="Delete job"
                    >
                      ✖
                    </button>
                  </Tooltip>
                </React.Fragment>
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
  state => state.settings.ipScan,
  ipScan => ({ ipScan }),
);

export default connect(mapsStateToProps)(IPScanStatus);
