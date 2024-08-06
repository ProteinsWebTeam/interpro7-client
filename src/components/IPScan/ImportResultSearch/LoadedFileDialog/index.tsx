import React from 'react';

import { connect } from 'react-redux';
import { importJobFromData } from 'actions/creators';
import id from 'utils/cheap-unique-id';

import Modal from 'components/SimpleCommonComponents/Modal';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideCheck from 'components/IPScan/NucleotideCheck';
import Button from 'components/SimpleCommonComponents/Button';

const isValid = (fileObj: Record<string, unknown>) => {
  return (
    typeof fileObj === 'object' &&
    'results' in fileObj &&
    'interproscan-version' in fileObj
  );
};

const saveJobInIDB = (
  results: Array<Iprscan5Result>,
  remoteID: string,
  localTitle: string | null,
  ipScanVersion: string,
  applications: Array<string> | string,
  importJobFromDataD: typeof importJobFromData,
) => {
  const localID = id(`internal-${Date.now()}`);
  const metadata = {
    localID,
    localTitle,
    type: 'InterProScan',
    remoteID,
    hasResults: results.some((result) => result?.matches?.length > 0),
    entries: results.length, // countInterProFromMatches(result.matches),
  };
  const data = {
    localID,
    'interproscan-version': ipScanVersion,
    results,
    applications,
  };
  importJobFromDataD({
    metadata,
    data,
  });
};

type Props = {
  show: boolean;
  closeModal: () => void;
  fileContent: Record<string, unknown>; // ProteinFile | NucleotideFile,
  fileName: string;
  importJobFromData: typeof importJobFromData;
};

const LoadedFileDialog = ({
  show,
  closeModal,
  fileContent,
  fileName,
  importJobFromData,
}: Props) => {
  let validFileContent: IprscanDataIDB | null = null;
  if (fileContent && isValid(fileContent))
    validFileContent = fileContent as IprscanDataIDB;

  const saveFileInIndexDB = () => {
    if (!validFileContent) return;

    saveJobInIDB(
      validFileContent.results,
      `imported_file-${fileName}`,
      null,
      validFileContent['interproscan-version'],
      validFileContent.applications,
      importJobFromData,
    );
    closeModal();
  };
  return (
    <Modal show={show} closeModal={closeModal}>
      <h2 id="modalTitle">InterProScan File</h2>
      {validFileContent ? (
        <>
          <p>
            Loading file: <code>{fileName}</code>
          </p>
          <p>
            You are about to load the analysis of{' '}
            <b>{validFileContent.results.length} sequences</b> with InterProScan
            version {validFileContent['interproscan-version']}
          </p>
          <IPScanVersionCheck
            ipScanVersion={fileContent['interproscan-version']}
          />
          <NucleotideCheck fileContent={validFileContent} />
          <div style={{ textAlign: 'right' }}>
            <Button onClick={saveFileInIndexDB}>OK</Button>
          </div>
        </>
      ) : (
        <p>We couldn&apos;t load the file. Check its format and try again.</p>
      )}
    </Modal>
  );
};

export default connect(undefined, { importJobFromData })(LoadedFileDialog);
