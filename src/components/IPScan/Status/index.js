import React, { Component } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import { connect } from 'react-redux';
import url from 'url';
import TA from 'timeago.js';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import getTableAccess from 'storage/idb';

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
    this._jobsTableAccess = getTableAccess('interproscan-jobs');
    this._blobsTableAccess = getTableAccess('blobs');
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
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h3>Your InterProScan searches</h3>
          {/* <button
            className={f('button', 'secondary')}
            onClick={this._checkAllUnfinishedJobs}
          >Refresh</button> */}
          <table className={f('hover')}>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Date</th>
                <th>Created</th>
                <th className={f('table-center')}>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .sort(
                  // Sort by creation time (newest first)
                  (
                    [, { times: { created: a } }],
                    [, { times: { created: b } }],
                  ) => b - a,
                )
                .map(
                  (
                    [
                      jobId,
                      { id, status, times: { created, lastUpdate }, saved },
                    ],
                  ) => {
                    const lastUpdateDate = new Date(lastUpdate);
                    const createdDate = new Date(created);
                    return (
                      <tr key={jobId}>
                        <td>
                          {id ? (
                            <Link
                              to={{
                                description: {
                                  main: { key: 'job' },
                                  search: {
                                    type: 'InterProScan',
                                    accession: id,
                                  },
                                },
                              }}
                              disabled={status !== 'finished'}
                            >
                              {id}
                            </Link>
                          ) : (
                            'None'
                          )}
                        </td>
                        <td>
                          <Tooltip title={`Created ${timeago.format(created)}`}>
                            <time dateTime={createdDate.toISOString()}>
                              {createdDate.toLocaleString()}
                            </time>
                          </Tooltip>
                        </td>
                        <td>
                          <Tooltip
                            title={`Last modified ${timeago.format(
                              lastUpdate,
                            )}`}
                          >
                            <time dateTime={createdDate.toISOString()}>
                              {timeago.format(lastUpdate)}
                            </time>
                          </Tooltip>
                        </td>
                        <td className={f('table-center')}>
                          <Tooltip title={`Job ${status}`}>
                            <time dateTime={lastUpdateDate.toISOString()}>
                              {status === 'running' && (
                                <span
                                  style={{ fontSize: '200%' }}
                                  className={f(
                                    'icon',
                                    'icon-generic',
                                    'ico-progress',
                                  )}
                                  data-icon="{"
                                  aria-label="Job running"
                                />
                              )}

                              {status === 'not found' ||
                              status === 'failure' ? (
                                <span
                                  style={{ fontSize: '160%' }}
                                  className={f(
                                    'icon',
                                    'icon-functional',
                                    'ico-notfound',
                                  )}
                                  data-icon="x"
                                  aria-label="Job failed or not found"
                                />
                              ) : null}

                              {status === 'finished' && (
                                <span
                                  style={{ fontSize: '160%' }}
                                  className={f(
                                    'icon',
                                    'icon-functional',
                                    'ico-confirmed',
                                  )}
                                  data-icon="/"
                                  aria-label="Job finished"
                                />
                              )}
                            </time>
                          </Tooltip>
                        </td>
                        <td
                          className={f('button-group')}
                          style={{ display: 'flex' }}
                        >
                          <Tooltip title="Save job">
                            <button
                              className={f(
                                'button',
                                saved ? 'warning' : 'secondary',
                              )}
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
                        </td>
                      </tr>
                    );
                  },
                )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connect(({ settings: { ipScan } }) => ({ ipScan }))(
  IPScanStatus,
);
