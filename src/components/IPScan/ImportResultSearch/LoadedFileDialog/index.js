// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { importJobFromData } from 'actions/creators';
import id from 'utils/cheap-unique-id';

import { countInterProFromMatches } from 'pages/Sequence';
import Modal from 'components/SimpleCommonComponents/Modal';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideCheck, {
  isNucleotideFile,
} from 'components/IPScan/NucleotideCheck';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

const isValid = (fileObj) => {
  return (
    typeof fileObj === 'object' &&
    'results' in fileObj &&
    'interproscan-version' in fileObj
  );
};
/*::
type ProteinResult = {
  xref: Array<{id: string}>,
  matches: Array<{signature:{entry: {}}}>,
  sequence: string,
  md5: string,
  group?: string,
  orf?: {},
}
type NucleotideResult = {
  id: string,
  sequence: string,
  md5: string,
  crossReferences: Array<{
    name: string,
    id: string,
  }>,
  openReadingFrames: Array<{
    id: number,
    start: number,
    end: number,
    strand: string,
    protein: ProteinResult,
  }>,
}
export type ProteinFile = {
  results: Array<ProteinResult>,
  'interproscan-version': string,
  applications: string[]|string,
}
export type NucleotideFile = {
  results: Array<NucleotideResult>,
  'interproscan-version': string,
  applications: string[]|string,
  }
type JobMetadata = {
  localID: string,
  localTitle: string,
  type: string,
  remoteID: string,
  hasResults: boolean,
  entries: Array<Object>,
  group?: string,
}
type Props = {
  show: Boolean,
  closeModal: function,
  fileContent: ProteinFile | NucleotideFile,
  fileName: string,
  importJobFromData: function,
}
*/

const saveJobInIDB = (
  result /*: ProteinResult */,
  remoteID /*: string */,
  localTitle /*: string */,
  ipScanVersion /*: string */,
  applications /*: ?string[]|string */,
  importJobFromData /*: function */,
) => {
  const localID = id(`internal-${Date.now()}`);
  const metadata /*: JobMetadata */ = {
    localID,
    localTitle,
    type: 'InterProScan',
    remoteID,
    hasResults: result.matches.length > 0,
    entries: countInterProFromMatches(result.matches),
  };
  const data = {
    'interproscan-version': ipScanVersion,
    input: result.sequence,
    results: [result],
    applications,
  };
  if (result.group) {
    metadata.group = result.group;
  }
  importJobFromData({
    metadata,
    data,
  });
};

const LoadedFileDialog = (
  { show, closeModal, fileContent, fileName, importJobFromData } /*: Props */,
) => {
  const saveFileInIndexDB = () => {
    for (let i = fileContent.results.length - 1; i >= 0; i--) {
      if (isNucleotideFile(fileContent)) {
        // prettier-ignore
        const result/*: NucleotideResult */ = (fileContent.results[i]/*: any */);
        const id = result.crossReferences?.[0]?.id;
        for (const orf of result.openReadingFrames) {
          const { protein, ...rest } = orf;
          protein.group = id;
          protein.orf = { ...rest, dnaSequence: result.sequence };
          if (protein.matches?.length) {
            saveJobInIDB(
              protein,
              `imported_file-${fileName}-${i + 1}-orf-${rest.id}`,
              `${id} - ORF:${rest.id}`,
              fileContent['interproscan-version'],
              fileContent.applications,
              importJobFromData,
            );
          }
        }
      } else {
        // prettier-ignore
        const result/*: ProteinResult */ = (fileContent.results[i]/*: any */);
        result.group = fileName;
        saveJobInIDB(
          result,
          `imported_file-${fileName}-${i + 1}`,
          result?.xref?.[0]?.id || `Seq ${i + 1} from ${fileName}`,
          fileContent['interproscan-version'],
          fileContent.applications,
          importJobFromData,
        );
      }
    }
    closeModal();
  };
  return (
    <Modal show={show} closeModal={closeModal}>
      <h2 id="modalTitle">InterProScan File</h2>
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
          <IPScanVersionCheck
            ipScanVersion={fileContent['interproscan-version']}
          />
          <NucleotideCheck fileContent={fileContent} />
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
LoadedFileDialog.propTypes = {
  show: T.bool,
  closeModal: T.func,
  fileContent: T.object,
  fileName: T.string,
  importJobFromData: T.func,
};

export default connect(undefined, { importJobFromData })(LoadedFileDialog);
