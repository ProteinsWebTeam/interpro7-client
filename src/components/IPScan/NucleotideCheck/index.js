// @flow
import React from 'react';
import T from 'prop-types';

import Loading from 'components/SimpleCommonComponents/Loading';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

/*::
  import type {ProteinFile, NucleotideFile} from 'components/IPScan/ImportResultSearch/LoadedFileDialog'
  type Props = {
    fileContent?: ProteinFile | NucleotideFile,
  }
*/
export const isNucleotideFile = (fileContent) =>
  'crossReferences' in (fileContent?.results?.[0] || {}) &&
  'openReadingFrames' in (fileContent?.results?.[0] || {});

const NucleotideCheck = ({ fileContent } /*: Props */) => {
  if (!fileContent) return <Loading inline={true} />;
  if (isNucleotideFile(fileContent)) {
    return (
      <Callout type="info">
        <b>Nucleotide Sequence</b>
        <p>
          We have detected this file as an InterProScan search result using a
          sequence of <b>nucleotides</b>.
        </p>
        <p>
          We will display it in the results as one result per open reading frame
        </p>
      </Callout>
    );
  }
  return null;
};
NucleotideCheck.propTypes = {
  fileContent: T.shape({
    results: T.arrayOf(T.object),
  }),
};
export default NucleotideCheck;
