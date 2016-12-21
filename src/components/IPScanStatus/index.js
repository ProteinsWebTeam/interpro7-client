import React, {PropTypes as T, Component} from 'react';
import Link from 'react-router/Link';
import {connect} from 'react-redux';
import url from 'url';
import TA from 'timeago.js';

import getTableAccess from 'storage/idb';

import f from 'styles/foundation';

let timeago;
const ONE_MINUTE = 60000;

const getDefinedjobs = state => Object.entries(state).filter(([, j]) => j);

const IPScanStatus = class extends Component {
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
    // Reference to timeout (ton cancel it on unmount)
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
        url.format({...this.props.ipScan, pathname: this.props.ipScan.root}),
        `status/${IPScanId}`
      )
    );
    const rawStatus = await response.text();
    return rawStatus.toLowerCase().replace('_', ' ');
  };

  _getAllJobs = async () => {
    const jobsTableAccess = await this._jobsTableAccess;
    const jobs = await jobsTableAccess.getAll();
    this.setState(jobs);
  };

  _checkAllUnfinishedJobs = async (recursive) => {
    const finishedStates = ['finished', 'failure', 'not found'];
    await Promise.all(
      getDefinedjobs(this.state)
        .filter(([, {status}]) => !finishedStates.includes(status))
        .map(async ([internalId, job]) => {
          const {id, status} = job;
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
            jobsTA.update(+internalId, job => ({...job, status: newStatus}));
          } catch (err) {
            console.error(err);
          }
          // Change job status in state
          this.setState({[internalId]: {...job, status: newStatus}});
        })
    );
    if (!recursive) return;
    // Schedule an other check later
    this._timeout = setTimeout(
      this._checkAllUnfinishedJobs,
      this.props.refreshRate
    );
  };

  _handleSave = async ({target: {dataset: {id}}}) => {
    console.log(`saving job with internal id ${id}`);
    console.warn('not implemented yet');
  };

  _handleDelete = async ({target: {dataset: {id}}}) => {
    console.log(`deleting job with internal id ${id}`);
    // Separate job to be deleted from the others
    const removedJob = this.state[id];
    // Do clean-up in IDB, to both tables concurrently
    await Promise.all([
      this._jobsTableAccess.then(ta => ta.delete(+id)),
      this._blobsTableAccess.then(
        ta => ta.delete(removedJob.input.sequenceBlobId)
      ),
    ]);
    this.setState({[id]: null});
  };

  render() {
    const jobs = getDefinedjobs(this.state);
    if (!jobs.length) return null;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h3>Your InterProScan searches:</h3>
          {/* <button
            className={f('button', 'secondary')}
            onClick={this._checkAllUnfinishedJobs}
          >Refresh</button> */}
          <table className={f('hover')}>
            <thead>
              <tr>
                <th>job ID</th>
                <th>created</th>
                <th>status</th>
                <th width="1">actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.sort(
                // Sort by creation time (newest first)
                ([, {times: {created: a}}], [, {times: {created: b}}]) => b - a
              ).map((
                [jobId, {id, status, times: {created, lastUpdate}, saved}]
              ) => {
                const lastUpdateDate = new Date(lastUpdate);
                return (
                  <tr key={jobId}>
                    <td>{
                      id ?
                        <Link to={`/sequencesearch/${id}`}>{id}</Link> :
                        'None'
                    }</td>
                    <td>
                      {timeago.format(created)}
                    </td>
                    <td>
                      <time
                        dateTime={lastUpdateDate.toISOString()}
                        title={`last update ${timeago.format(lastUpdate)}`}
                      >
                        {status}
                      </time>
                    </td>
                    <td className={f('button-group')}>
                      <button
                        className={f('button', saved ? 'warning' : 'secondary')}
                        title={`save job ${id || ''}`}
                        type="button"
                        data-id={jobId}
                        onClick={this._handleSave}
                      >★</button>
                      <button
                        className={f('button', 'alert')}
                        title={`delete job ${id || ''}`}
                        type="button"
                        data-id={jobId}
                        onClick={this._handleDelete}
                      >✖</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default connect(({settings: {ipScan}}) => ({ipScan}))(IPScanStatus);
