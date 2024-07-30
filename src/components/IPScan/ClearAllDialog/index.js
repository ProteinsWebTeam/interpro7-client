// @flow

import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
// $FlowFixMe
import { deleteJob } from 'actions/creators';

import Modal from 'components/SimpleCommonComponents/Modal';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

/*::
  type Props = {
    show: Boolean,
    closeModal: function,
    jobs: Array<{ localID: string }>,
    from: string,
    deleteJob: function,
  }
*/

const ClearAllDialog = (
  { show, closeModal, jobs, from, deleteJob } /*: Props */,
) => {
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
ClearAllDialog.propTypes = {
  show: T.bool,
  closeModal: T.func,
  deleteJob: T.func,
  jobs: T.arrayOf(
    T.shape({
      localID: T.string,
    }),
  ),
  from: T.string,
};

export default connect(undefined, { deleteJob })(ClearAllDialog);
