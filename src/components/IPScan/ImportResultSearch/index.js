import React, { useState } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import LoadedFileDialog from './LoadedFileDialog';

import { foundationPartial } from 'styles/foundation';
import blockEvent from 'utils/block-event';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import { goToCustomLocation } from 'actions/creators';

const f = foundationPartial(interproTheme, fonts, local, ipro);

const TITLE = 'Import Result';
const ImportResultSearch = ({ goToCustomLocation }) => {
  const [id, setId] = useState('');
  const [isValid, setValid] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const handleImport = () => {
    goToCustomLocation({
      description: {
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          accession: id,
        },
      },
    });
  };
  const handleChange = (event) => {
    try {
      descriptionToDescription({
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          accession: event.target.value,
        },
      });
      setValid(true);
    } catch (error) {
      setValid(false);
    }
    setId(event.target.value);
  };
  const handleKeyPress = (event) => {
    const enterKey = 13;
    if (event.charCode === enterKey) {
      if (isValid) handleImport();
    }
  };

  const _handleContent = (text) => {
    try {
      const result = JSON.parse(text);
      setFileContent(result);
    } catch {
      setFileName(null);
      console.error("File couldn't be parsed as JSON");
    }
    setShowModal(true);
  };

  const _handleFile = (file) => {
    setFileContent(null);
    setFileName(file.name);
    const fr = new FileReader();
    fr.onload = () => {
      _handleContent(fr.result);
    };
    fr.readAsText(file);
  };
  const _handleFileChange = ({ target }) => {
    _handleFile(target.files[0]);
    target.value = null;
  };
  const _handleDragging = blockEvent(() => setDragging(true));
  const _handleUndragging = blockEvent(() => setDragging(false));
  const _handleDroppedFiles = blockEvent(
    ({
      dataTransfer: {
        files: [file],
      },
    }) => {
      _handleFile(file);
      setDragging(false);
    },
  );

  return (
    <div
      className={f('import-result', { dragging: isDragging })}
      onDrop={_handleDroppedFiles}
      onDrag={_handleDragging}
      onDragStart={_handleDragging}
      onDragEnd={_handleUndragging}
      onDragOver={_handleDragging}
      onDragEnter={_handleDragging}
      onDragExit={_handleUndragging}
      onDragLeave={_handleUndragging}
    >
      <label className={f('import-label')} htmlFor="interproScanId">
        Import:
      </label>
      <input
        name="interproScanId"
        type="text"
        placeholder="InterProScan ID"
        value={id}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <Button
        disabled={!isValid}
        // className={f('button')}
        aria-label={`${TITLE} from server with ID`}
        onClick={handleImport}
        icon="icon-cloud-download-alt"
      />

      <label
        aria-label={`${TITLE} from file`}
        className={f('button', 'icon', 'icon-common')}
        data-icon="&#xf093;"
      >
        {' '}
        <input type="file" onChange={_handleFileChange} hidden accept=".json" />
      </label>
      <div className={f('dragging-overlay')}>Drop your file here</div>
      <LoadedFileDialog
        show={showModal}
        fileContent={fileContent}
        fileName={fileName}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};
ImportResultSearch.propTypes = {
  goToCustomLocation: T.func,
};
export default connect(undefined, { goToCustomLocation })(ImportResultSearch);
