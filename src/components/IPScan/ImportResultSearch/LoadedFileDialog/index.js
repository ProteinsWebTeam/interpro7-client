import React from 'react';
import Modal from 'components/SimpleCommonComponents/Modal';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const isValid = (fileObj) => {
  return (
    typeof fileObj === 'object' &&
    'results' in fileObj &&
    'interproscan-version' in fileObj
  );
};
const LoadedFileDialog = ({ show, closeModal, fileContent }) => {
  return (
    <Modal show={show} closeModal={closeModal}>
      <h2 id="modalT(itle">InterProScan File</h2>
      {fileContent && isValid(fileContent) ? (
        <>
          <p>
            You are about to load the analysis of{' '}
            <b>{fileContent.results.length} sequences</b> with InterProScan
            version {fileContent['interproscan-version']}
          </p>
          <div style={{ textAlign: 'right' }}>
            <button className={f('button')}>OK</button>
          </div>
        </>
      ) : (
        <p>We couldn't load the file. Check its format and try again.</p>
      )}
    </Modal>
  );
};

export default LoadedFileDialog;
