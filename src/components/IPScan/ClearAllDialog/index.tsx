import React from 'react';

import { connect } from 'react-redux';
import { deleteJob } from 'actions/creators';

import Modal from 'components/SimpleCommonComponents/Modal';
import Button from 'components/SimpleCommonComponents/Button';

export type SourceToRemove = null | 'file' | 'server';

type Props = {
  show: boolean;
  closeModal: () => void;
  jobs: Array<MinimalJobMetadata>;
  from: SourceToRemove;
  deleteJob: typeof deleteJob;
};

const ClearAllDialog = ({ show, closeModal, jobs, from, deleteJob }: Props) => {
  const deleteJobs = () => {
    for (const job of jobs) {
      deleteJob({ metadata: { localID: job.localID } });
    }
    closeModal();
  };
  return (
    <Modal show={show} closeModal={closeModal}>
      <h2 id="modalTitle">Clear all InterProScan jobs</h2>
      {jobs && jobs.length ? (
        <>
          <p>
            You are about to permanently remove {jobs.length} InterProScan jobs
            that were loaded from {from}.
          </p>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={deleteJobs}>Delete</Button>
          </div>
        </>
      ) : (
        <p>There are not jobs loaded from {from} to delete.</p>
      )}
    </Modal>
  );
};

export default connect(undefined, { deleteJob })(ClearAllDialog);
