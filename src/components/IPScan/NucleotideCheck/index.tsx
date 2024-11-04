import React from 'react';

import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';

export const isNucleotideFile = (fileContent: IprscanDataIDB | null) =>
  'crossReferences' in (fileContent?.results?.[0] || {}) &&
  'openReadingFrames' in (fileContent?.results?.[0] || {});

type Props = { fileContent: IprscanDataIDB };

const NucleotideCheck = ({ fileContent }: Props) => {
  if (!fileContent) return <Loading inline={true} />;
  if (isNucleotideFile(fileContent)) {
    return (
      <Callout type="info" showIcon icon="icon-dna">
        <b>Nucleotide Sequence</b>
        <p>
          We have detected this file as an InterProScan search result using a
          sequence of <b>nucleotides</b>.
        </p>
      </Callout>
    );
  }
  return null;
};

export default NucleotideCheck;
