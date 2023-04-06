// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { deleteJob, goToCustomLocation } from 'actions/creators';
import getTableAccess, { IPScanJobsData } from 'storage/idb';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const f = foundationPartial(fonts, ipro, local);

const downloadFile = (jsonContent, name) => {
  const downloadContent = JSON.stringify(jsonContent);
  const blob = new Blob([downloadContent], { type: 'application/json' });

  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob);
  link.download = name;

  document.body?.appendChild(link);
  link.click();

  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.parentNode?.removeChild(link);
  }, 0);
};

const mergeSequences = (results) => {
  let seqs = '';
  let i = 1;
  for (const result of results) {
    seqs += `> ${result.xref?.[0]?.id || `Sequence ${i++}`}\n${(
      (result.sequence || '').match(/(.{1,60})/g) || []
    ).join('\n')}\n`;
  }
  return seqs;
};

/*::
type Props = {
  group: string,
  deleteJob: (string)=>void,
  goToCustomLocation: (Object)=>void,
  jobs: {
    [string]: {
      metadata: {
        group:string
      }
    }
  },
}
  */
const GroupActions = (
  { group, jobs, deleteJob, goToCustomLocation } /*: Props */,
) => {
  const getJobsOfGroup = () =>
    // prettier-ignore
    (Object.values(jobs) /*: any */)
      .filter(
        ({ metadata } /*: {metadata:{group: string}} */) =>
          metadata.group === group,
      );
  const getAllResults = async () => {
    const dataT = await getTableAccess(IPScanJobsData);
    const results = [];
    let output = {};
    for (const job of getJobsOfGroup()) {
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
  const handleDelete = () => {
    getJobsOfGroup().forEach((job) => deleteJob(job));
  };

  const handleDownload = async () => {
    downloadFile(await getAllResults(), `${group}.json`);
  };
  const handleReRun = async () => {
    const results = await getAllResults();
    const search = {};
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
          value: mergeSequences(results.results),
        },
      },
      search,
    });
  };

  return (
    <nav className={f('buttons')}>
      <DropDownButton
        label="Group Actions"
        icon="&#xf03a;"
        color="rgb(249, 249, 249)"
        hollow
      >
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
                className={f('icon', 'icon-common', 'ico-neutral', 'group')}
                onClick={handleDelete}
                data-icon="&#xf1f8;"
                aria-label="Delete Results"
              >
                {' '}
                Delete All
              </button>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              title={
                <div>
                  <b>Download All Jobs</b>: This will create a single file with
                  all the results of this group
                </div>
              }
            >
              <button
                className={f('icon', 'icon-common', 'ico-neutral', 'group')}
                onClick={handleDownload}
                data-icon="&#xf019;"
                aria-label="Download group results"
              >
                {' '}
                Download All
              </button>
            </Tooltip>
          </li>
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
                className={f('icon', 'icon-common', 'ico-neutral', 'group')}
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
GroupActions.propTypes = {
  group: T.string.isRequired,
  jobs: T.object,
  deleteJob: T.func,
  goToCustomLocation: T.func,
};

const mapStateToProps = createSelector(
  (state) => state.jobs,
  (jobs) => ({ jobs }),
);

export default connect(mapStateToProps, {
  deleteJob,
  goToCustomLocation,
})(GroupActions);
