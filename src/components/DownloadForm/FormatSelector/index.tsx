import React from 'react';
import { noop } from 'lodash-es';

export const format2label = {
  accession: 'Text (List of Accessions)',
  fasta: 'FASTA',
  json: 'JSON',
  tsv: 'TSV',
};
type Props = {
  fileType: keyof typeof format2label;
  mainEndpoint: Endpoint;
  hasSelectedDB: boolean;
  hasSelectedAccession: boolean;
};
const FormatSelector = ({
  fileType,
  mainEndpoint,
  hasSelectedDB,
  hasSelectedAccession,
}: Props) => (
  <select
    name="fileType"
    value={fileType || 'accession'}
    aria-label="Download type"
    onChange={noop}
    onBlur={noop}
  >
    <option value="accession" disabled={!hasSelectedDB || hasSelectedAccession}>
      {format2label.accession}
    </option>
    <option value="fasta" disabled={mainEndpoint !== 'protein'}>
      {format2label.fasta}
    </option>
    <option value="json">{format2label.json}</option>
    <option value="tsv" disabled={!hasSelectedDB || hasSelectedAccession}>
      {format2label.tsv}
    </option>
  </select>
);

export default FormatSelector;
