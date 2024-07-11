import React from 'react';

import { connect } from 'react-redux';
import { importJobFromData } from 'actions/creators';
import id from 'utils/cheap-unique-id';

import Modal from 'components/SimpleCommonComponents/Modal';
import IPScanVersionCheck from 'components/IPScan/IPScanVersionCheck';
import NucleotideCheck, {
  isNucleotideFile,
} from 'components/IPScan/NucleotideCheck';
import Button from 'components/SimpleCommonComponents/Button';

const isValid = (fileObj: Record<string, unknown>) => {
  return (
    typeof fileObj === 'object' &&
    'results' in fileObj &&
    'interproscan-version' in fileObj
  );
};

// TODO: remove this types once the nucleotide file logic is restored
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
*/

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
  fileContent: IprscanDataIDB; // ProteinFile | NucleotideFile,
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
  const saveFileInIndexDB = () => {
    // TODO: 🔰 nucleotides staff hasn't been migrated!
    if (isNucleotideFile(fileContent)) {
      // for (let i = fileContent.results.length - 1; i >= 0; i--) {
      //   // prettier-ignore
      //   const result/*: NucleotideResult */ = (fileContent.results[i]/*: any */);
      //   const id = result.crossReferences?.[0]?.id;
      //   for (const orf of result.openReadingFrames) {
      //     const { protein, ...rest } = orf;
      //     protein.group = id;
      //     protein.orf = { ...rest, dnaSequence: result.sequence };
      //     if (protein.matches?.length) {
      //       saveJobInIDB(
      //         protein,
      //         `imported_file-${fileName}-${i + 1}-orf-${rest.id}`,
      //         `${id} - ORF:${rest.id}`,
      //         fileContent['interproscan-version'],
      //         fileContent.applications,
      //         importJobFromData,
      //       );
      //     }
      //   }
      // }
    } else {
      saveJobInIDB(
        fileContent.results,
        `imported_file-${fileName}`,
        null,
        fileContent['interproscan-version'],
        fileContent.applications,
        importJobFromData,
      );
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

export default connect(undefined, { importJobFromData })(LoadedFileDialog);
