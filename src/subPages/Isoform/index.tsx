import React from 'react';

import Sequence, { InnerSequence } from 'components/Protein/Sequence';

type Props = {
  data: RequestedData<MetadataPayload<ProteinMetadata> | IprscanDataIDB>;
  localPayload: LocalPayload;
  localTitle: string;
  orf?: number;
};

const SequenceSubPage = ({ data, localPayload, localTitle, orf }: Props) => {
  let accession;
  let sequence;
  let name;
  const local = localPayload;
  let payload = null;
  const { loading, ok } = data;
  const hasORF =
    (local as Iprscan5NucleotideResult)?.openReadingFrames?.length &&
    typeof orf !== 'undefined';
  const currentORF = hasORF
    ? (local as Iprscan5NucleotideResult)?.openReadingFrames?.[orf!]
    : undefined;
  const protein = currentORF?.protein;

  if (ok && !loading && !payload && data?.payload) {
    payload = data?.payload;
  }
  if (!payload && !local) return null;
  if ((payload as MetadataPayload)?.metadata) {
    const metadata = (payload as MetadataPayload<ProteinMetadata>)?.metadata;
    accession = metadata?.accession;
    sequence = metadata?.sequence;
    name = (metadata?.name as unknown as NameObject)?.name || metadata?.name;
    // TODO: Remove by October 2024 - I think this case is never reached.
    // } else if ((payload as IprscanDataIDB)?.results) {
    //   const results = (payload as IprscanDataIDB).results;
    //   accession = results?.[0]?.xref?.accession;
    //   sequence = results?.[0]?.xref?.sequence;
    //   name = results?.[0]?.xref?.name?.name;
  } else if (hasORF && protein) {
    accession = protein.xref[0].id || '';
    name = protein.xref[0].name || '';
    sequence = protein.sequence;
  } else {
    const result = local as Iprscan5Result;
    accession = result.xref[0].id || '';
    name = localTitle || result.xref[0].name || '';
    sequence = result.sequence;
  }
  return (
    <>
      <Sequence accession={accession} sequence={sequence} name={name} />
      {hasORF && protein ? (
        <section id="nucleotides">
          <h5>Nucleotide Sequence</h5>
          <InnerSequence
            sequence={local?.sequence}
            start={currentORF.start}
            end={currentORF.end}
            name={protein.xref[0].name}
          />
        </section>
      ) : (
        ''
      )}
    </>
  );
};

export default SequenceSubPage;
