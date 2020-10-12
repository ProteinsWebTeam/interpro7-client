import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { importJobFromData } from 'actions/creators';
import id from 'utils/cheap-unique-id';

import { countInterProFromMatches } from 'pages/Sequence';
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
const LoadedFileDialog = ({
  show,
  closeModal,
  fileContent,
  fileName,
  importJobFromData,
}) => {
  const saveFileInIndexDB = () => {
    for (let i = fileContent.results.length - 1; i >= 0; i--) {
      const result = fileContent.results[i];
      const localID = id(`internal-${Date.now()}`);
      importJobFromData({
        metadata: {
          localID,
          localTitle: `Seq ${i + 1} from ${fileName}`,
          type: 'InterProScan',
          remoteID: `imported_file-${fileName}-${i + 1}`,
          hasResults: result.matches.length > 0,
          entries: countInterProFromMatches(result.matches),
        },
        data: {
          'interproscan-version': fileContent['interproscan-version'],
          input: result.sequence,
          results: [result],
        },
      });
    }
    closeModal();
  };
  return (
    <Modal show={show} closeModal={closeModal}>
      <h2 id="modalT(itle">InterProScan File</h2>
      {fileContent && isValid(fileContent) ? (
        <>
          <p>
            Loading file: <code>{fileName}</code>
          </p>
          <p>
            You are about to load the analysis of{' '}
            <b>{fileContent.results.length} sequences</b> with InterProScan
            version {fileContent['interproscan-version']}
          </p>
          <div style={{ textAlign: 'right' }}>
            <button className={f('button')} onClick={saveFileInIndexDB}>
              OK
            </button>
          </div>
        </>
      ) : (
        <p>We couldn&apos;t load the file. Check its format and try again.</p>
      )}
    </Modal>
  );
};
LoadedFileDialog.propTypes = {
  show: T.bool,
  closeModal: T.func,
  fileContent: T.object,
  fileName: T.string,
  importJobFromData: T.func,
};

export default connect(undefined, { importJobFromData })(LoadedFileDialog);
