import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import { deleteJob, goToCustomLocation } from 'actions/creators';
import getTableAccess, { IPScanJobsData } from 'storage/idb';

import DownloadAll from './DownloadAll';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const css = cssBinder(fonts, local);

const mergeSequences = (results: Array<Iprscan5Result>) => {
  let seqs = '';
  let i = 1;
  for (const result of results) {
    seqs += `> ${result.xref?.[0]?.id || `Sequence ${i++}`}\n${(
      (result.sequence || '').match(/(.{1,60})/g) || []
    ).join('\n')}\n`;
  }
  return seqs;
};

export type Jobs = Record<
  string,
  {
    metadata: IprscanMetaIDB;
  }
>;
type Props = {
  group: string;
  deleteJob: typeof deleteJob;
  goToCustomLocation: typeof goToCustomLocation;
  jobs: Jobs;
};

const getJobsOfGroup = (jobs: Jobs, group: string) =>
  Object.values(jobs).filter(({ metadata }) => metadata.group === group);

export const getAllResults = async (jobs: Jobs, group: string) => {
  const dataT = await getTableAccess(IPScanJobsData);
  const results = [];
  let output: Record<string, unknown> = {};
  for (const job of getJobsOfGroup(jobs, group)) {
    const {
      results: r,
      localID: _,
      originalInput: __,
      ...metadata
    } = await dataT.get(job.metadata.localID);
    results.push(r[0]);
    output = { ...output, ...metadata };
  }
  output.results = results;
  return output;
};

const getRemoteID = (jobs: Jobs, group: string) => {
  const jobWithRemoteID = Object.values(jobs).find(
    (job) => job.metadata.group === group && job.metadata.remoteID,
  );
  if (jobWithRemoteID) {
    return jobWithRemoteID.metadata.remoteID.replace(/-\d+$/, '');
  }
  return;
};
const GroupActions = ({
  group,
  jobs,
  deleteJob,
  goToCustomLocation,
}: Props) => {
  const handleDelete = () => {
    getJobsOfGroup(jobs, group).forEach((job) => deleteJob(job));
  };

  const handleReRun = async () => {
    const results = await getAllResults(jobs, group);
    const search: Record<string, unknown> = {};
    if (results?.applications) {
      search.applications =
        typeof results.applications === 'string'
          ? [results.applications]
          : results.applications;
    }
    goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: {
          type: 'sequence',
          value: mergeSequences(results.results as Iprscan5Result[]),
        },
      },
      search,
    });
  };

  return (
    <nav className={css('buttons')}>
      <DropDownButton label="Group Actions" icon="&#xf03a;">
        <ul>
          <li>
            <Tooltip
              title={
                <div>
                  <b>Delete All Jobs</b>: This will remove the stored data of
                  all the sequences associated with this job from your browser.
                  Remember that search results are only retained on our servers
                  for 7 days
                </div>
              }
            >
              <button
                className={css('icon', 'icon-common', 'ico-neutral', 'group')}
                onClick={handleDelete}
                data-icon="&#xf1f8;"
                aria-label="Delete Results"
              >
                {' '}
                Delete All
              </button>
            </Tooltip>
          </li>
          <DownloadAll
            jobs={jobs}
            group={group}
            remoteID={getRemoteID(jobs, group)}
          />
          <li>
            <Tooltip
              title={
                <div>
                  <b>Re-run All Sequences</b>: This will take you to the
                  sequence search for prepopulating all values with the ones
                  used for this job.
                </div>
              }
            >
              <button
                className={css('icon', 'icon-common', 'ico-neutral', 'group')}
                onClick={handleReRun}
                data-icon="&#xf019;"
                aria-label="Re run all sequences"
              >
                {' '}
                Re-run All
              </button>
            </Tooltip>
          </li>
        </ul>
      </DropDownButton>
    </nav>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.jobs,
  (jobs) => ({ jobs }),
);

export default connect(mapStateToProps, {
  deleteJob,
  goToCustomLocation,
})(GroupActions);
