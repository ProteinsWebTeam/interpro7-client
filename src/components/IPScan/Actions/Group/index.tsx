import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Button from 'components/SimpleCommonComponents/Button';

import { deleteJob, goToCustomLocation } from 'actions/creators';
import getTableAccess, { IPScanJobsData } from 'storage/idb';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const css = cssBinder(fonts, local);

type Props = {
  group: string;
  deleteJob: typeof deleteJob;
  goToCustomLocation: typeof goToCustomLocation;
  jobs: JobsState;
};

const getJobsOfGroup = (jobs: JobsState, group: string) =>
  Object.values(jobs).filter(({ metadata }) => metadata.group === group);

export const getAllResults = async (jobs: JobsState, group: string) => {
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

const GroupActions = ({ group, jobs, deleteJob }: Props) => {
  const handleDelete = () => {
    getJobsOfGroup(jobs, group).forEach((job) => deleteJob(job));
  };

  return (
    <nav className={css('buttons')}>
      <DropDownButton label="Group Actions" icon="icon-list">
        <ul>
          <li>
            <Tooltip
              title={
                <div>
                  Delete all the stored data related to the sequences associated
                  with this job from your browser. Please note that search
                  results are stored on our servers for only 7 days.
                </div>
              }
            >
              <Button
                className={css('group')}
                type="hollow"
                onClick={handleDelete}
                icon="icon-trash"
                aria-label="Delete Results"
              >
                Delete All
              </Button>
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
