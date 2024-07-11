import React, { FormEvent, KeyboardEvent, useState } from 'react';
import { connect } from 'react-redux';

import descriptionToDescription from 'utils/processDescription/descriptionToDescription';
import { goToCustomLocation } from 'actions/creators';
import blockEvent from 'utils/block-event';

import Button from 'components/SimpleCommonComponents/Button';

import LoadedFileDialog from './LoadedFileDialog';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const css = cssBinder(fonts, local, buttonCSS);

const TITLE = 'Import Result';
type Props = {
  goToCustomLocation: typeof goToCustomLocation;
};

const ImportResultSearch = ({ goToCustomLocation }: Props) => {
  const [id, setId] = useState('');
  const [isValid, setValid] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileContent, setFileContent] = useState<Record<string, unknown>>({});
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImport = () => {
    goToCustomLocation({
      description: {
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          job: id,
        },
      },
    });
  };

  const handleChange = (event: FormEvent) => {
    const value = (event.target as HTMLInputElement).value;
    try {
      descriptionToDescription({
        main: { key: 'result' },
        result: {
          type: 'InterProScan',
          job: value,
        },
      });
      setValid(true);
    } catch (error) {
      setValid(false);
    }
    setId(value);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (isValid) handleImport();
    }
  };

  const _handleContent = (text: string) => {
    try {
      const result = JSON.parse(text);
      setFileContent(result);
    } catch {
      setFileName(null);
      console.error("File couldn't be parsed as JSON");
    }
    setShowModal(true);
  };

  const _handleFile = (file?: File) => {
    if (!file) return; // Maybe raise an exemption???
    setFileContent({});
    setFileName(file.name);
    const fr = new FileReader();
    fr.onload = () => {
      _handleContent(fr.result as string);
    };
    fr.readAsText(file);
  };

  const _handleFileChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    _handleFile(target.files?.[0]);
    target.value = '';
  };

  const _handleDragging = blockEvent(() => setDragging(true));

  const _handleUndragging = blockEvent(() => setDragging(false));

  const _handleDroppedFiles = blockEvent(({ dataTransfer }: DragEvent) => {
    if (!dataTransfer) return;
    const {
      files: [file],
    } = dataTransfer;
    _handleFile(file);
    setDragging(false);
  });

  return (
    <div
      className={css('import-result', { dragging: isDragging })}
      onDrop={_handleDroppedFiles}
      onDrag={_handleDragging}
      onDragStart={_handleDragging}
      onDragEnd={_handleUndragging}
      onDragOver={_handleDragging}
      onDragEnter={_handleDragging}
      onDragExit={_handleUndragging}
      onDragLeave={_handleUndragging}
    >
      <label className={css('import-label')} htmlFor="interproScanId">
        Import:
      </label>
      <input
        name="interproScanId"
        type="text"
        placeholder="InterProScan ID"
        value={id}
        onChange={handleChange}
        onKeyUp={handleKeyPress}
      />
      <Button
        disabled={!isValid}
        aria-label={`${TITLE} from server with ID`}
        onClick={handleImport}
        icon="icon-cloud-download-alt"
      />

      <label
        aria-label={`${TITLE} from file`}
        className={`vf-button ${css(
          'icon',
          'icon-common',
          'vf-button',
          'vf-button--primary',
          'vf-button--sm',
        )}`}
        data-icon="&#xf093;"
      >
        {' '}
        <input type="file" onChange={_handleFileChange} hidden accept=".json" />
      </label>
      <div className={css('dragging-overlay')}>Drop your file here</div>
      <LoadedFileDialog
        show={showModal}
        fileContent={fileContent}
        fileName={fileName || ''}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default connect(undefined, { goToCustomLocation })(ImportResultSearch);
