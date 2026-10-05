import React, { useEffect, useState } from 'react';

import Loading from 'components/SimpleCommonComponents/Loading';

import config from 'config';

// Same embed and limits as UniProt's SeqHub panel
const SEQHUB_EMBED = 'https://seqhub.org/embed/search-list?q=';
// TODO: switch to https://seqhub.org once Tatta Bio deploys feature-list
const SEQHUB_PFAM_EMBED =
  'https://seqhub-ui-staging-pr-1468.onrender.com/embed/feature-list?features=';
// The sequence goes in the URL; SeqHub returns 431 above ~16k residues
const MAX_LENGTH = 8000;
// Bacteria and Archaea taxIds
const PROKARYOTES = new Set(['2', '2157']);

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
  const taxId = isPfam ? undefined : metadata?.source_organism?.taxId;
  const [isProkaryote, setIsProkaryote] = useState<boolean | null>(null);

  useEffect(() => {
    if (!taxId) return;
    fetch(`${config.root.API.href}taxonomy/uniprot/${taxId}`)
      .then((response) => response.json())
      .then((payload) => {
        const lineage: string = payload?.metadata?.lineage || '';
        setIsProkaryote(
          lineage
            .trim()
            .split(/\s+/)
            .some((id) => PROKARYOTES.has(id)),
        );
      })
      .catch(() => setIsProkaryote(false));
  }, [taxId]);

  if (data.loading || !metadata) return <Loading />;

  if (isPfam)
    return (
      <SeqHubFrame
        src={`${SEQHUB_PFAM_EMBED}${encodeURIComponent(metadata.accession)}`}
      />
    );

  if (isProkaryote === null) return <Loading />;

  if (!isProkaryote)
    return (
      <p>
        Genomic context is only available for bacterial and archaeal proteins.
      </p>
    );
  if (metadata.sequence.length > MAX_LENGTH)
    return (
      <p>
        Genomic context is only available for sequences up to {MAX_LENGTH}{' '}
        residues.
      </p>
    );

  return (
    <SeqHubFrame
      src={`${SEQHUB_EMBED}${encodeURIComponent(metadata.sequence)}`}
    />
  );
};

export default GenomicContextSubPage;
