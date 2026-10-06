import { useEffect, useState } from 'react';

import config from 'config';

// Bacteria and Archaea taxIds
const PROKARYOTES = new Set(['2', '2157']);

const lineageCache = new Map<number, Promise<boolean>>();
const isProkaryote = (taxId: number) => {
  if (!lineageCache.has(taxId)) {
    lineageCache.set(
      taxId,
      fetch(`${config.root.API.href}taxonomy/uniprot/${taxId}`)
        .then((response) => response.json())
        .then((payload) => {
          const lineage: string = payload?.metadata?.lineage || '';
          return lineage
            .trim()
            .split(/\s+/)
            .some((id) => PROKARYOTES.has(id));
        })
        .catch(() => false),
    );
  }
  return lineageCache.get(taxId)!;
};

// Pfam families supported by SeqHub, loaded in its own chunk on demand
let pfamAllowList: Promise<Set<string>> | null = null;
const isPfamAllowed = (accession: string) => {
  if (!pfamAllowList) {
    pfamAllowList = import(
      /* webpackChunkName: "genomic-context-pfam-list" */ './pfam_allowlist.txt'
    )
      .then(
        ({ default: content }) =>
          new Set(
            content
              .split(/\s+/)
              .map((line) => line.trim().toUpperCase())
              .filter((line) => /^PF\d{5}$/.test(line)),
          ),
      )
      .catch(() => new Set<string>());
  }
  return pfamAllowList.then((list) => list.has(accession.toUpperCase()));
};

/**
 * Whether the Genomic Context tab applies to the given metadata:
 * prokaryotic proteins and Pfam families in the allow list.
 * `null` while it is still being checked.
 */
export const useGenomicContextAvailability = (
  mainKey?: string | null,
  metadata?: Metadata,
): boolean | null => {
  const key = mainKey?.toLowerCase();
  const db = (metadata?.source_database as string | undefined)?.toLowerCase();
  const accession = metadata?.accession as string | undefined;
  const taxId =
    key === 'protein'
      ? (metadata as ProteinMetadata | undefined)?.source_organism?.taxId
      : undefined;
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let check: Promise<boolean> | null = null;
    if (key === 'entry' && db) {
      check =
        db === 'pfam' && accession
          ? isPfamAllowed(accession)
          : Promise.resolve(false);
    } else if (key === 'protein' && taxId) {
      check = isProkaryote(taxId);
    }
    if (!check) return;
    let active = true;
    setAvailable(null);
    check.then((result) => {
      if (active) setAvailable(result);
    });
    return () => {
      active = false;
    };
  }, [key, db, accession, taxId]);

  return available;
};
