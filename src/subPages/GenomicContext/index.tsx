import React from 'react';

import Loading from 'components/SimpleCommonComponents/Loading';

import config from 'config';

import { useGenomicContextAvailability } from './availability';

// Lets SeqHub track requests coming from InterPro
const SEQHUB_PARTNER = 'interpro';
// The sequence goes in the URL; SeqHub returns 431 above ~16k residues
const MAX_LENGTH = 8000;

type Props = {
  data: RequestedData<MetadataPayload<ProteinMetadata | EntryMetadata>>;
};

const SeqHubFrame = ({ src }: { src: string }) => (
  <section>
    <h4>Genomic context similarity</h4>
    <iframe
      title="Genomic context similarity from SeqHub"
      src={src}
      width="100%"
      height="526"
      style={{ border: 0 }}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      referrerPolicy="no-referrer"
    />
  </section>
);

const GenomicContextSubPage = ({ data }: Props) => {
  const metadata = data?.payload?.metadata as ProteinMetadata | undefined;
  const isPfam =
    (metadata?.source_database as string)?.toLowerCase() === 'pfam';
  const available = useGenomicContextAvailability(
    isPfam ? 'entry' : 'protein',
    metadata,
  );

  if (data.loading || !metadata || available === null) return <Loading />;

  if (!available)
    return (
      <p>
        Genomic context is only available for bacterial and archaeal proteins,
        and for selected Pfam families.
      </p>
    );

  if (isPfam)
    return (
      <SeqHubFrame
        src={`${
          config.root.SeqHubPfam.href
        }embed/feature-list?features=${encodeURIComponent(
          metadata.accession,
        )}&partner=${SEQHUB_PARTNER}`}
      />
    );

  if (metadata.sequence.length > MAX_LENGTH)
    return (
      <p>
        Genomic context is only available for sequences up to {MAX_LENGTH}{' '}
        residues.
      </p>
    );

  // Same embed and limits as UniProt's SeqHub panel
  return (
    <SeqHubFrame
      src={`${config.root.SeqHub.href}embed/search-list?q=${encodeURIComponent(
        metadata.sequence,
      )}`}
    />
  );
};

export default GenomicContextSubPage;
