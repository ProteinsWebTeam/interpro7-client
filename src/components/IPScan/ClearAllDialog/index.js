import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { deleteJob } from 'actions/creators';

import Modal from 'components/SimpleCommonComponents/Modal';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const ClearAllDialog = ({ show, closeModal, jobs, from, deleteJob }) => {
  const deleteJobs = () => {
    for (let job of jobs) {
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
            <button className={f('button')} onClick={deleteJobs}>
              Delete
            </button>
          </div>
        </>
      ) : (
        <p>There are not jobs loaded from {from} to delete.</p>
      )}
    </Modal>
  );
};
ClearAllDialog.propTypes = {
  show: T.bool,
  closeModal: T.func,
  deleteJob: T.func,
};

export default connect(undefined, { deleteJob })(ClearAllDialog);
