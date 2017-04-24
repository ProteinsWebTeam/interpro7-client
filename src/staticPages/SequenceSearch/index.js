import React, {Component} from 'react';
import T from 'prop-types';

import getTableAccess from 'storage/idb';

export default class extends Component {
  static propTypes = {
    params: T.shape({
      job: T.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this._jobsTableAccess = getTableAccess('interproscan-jobs');
  }

  componentDidMount() {
    this._getAllJobs();
  }

  _getAllJobs = async () => {
    const jobsTA = await this._jobsTableAccess;
    const jobs = await jobsTA.getAll();
    this.setState(jobs);
  };

  render() {
    const [, job] = Object.entries(this.state)
      .find(([, {id}]) => id === this.props.params.job) || [];
    console.log(job);
    if (!job) return null;
    return (
      <section>
        <h2>Job: {job.id}</h2>
        <h3>Status: {job.status}</h3>
      </section>
    );
  }
}
