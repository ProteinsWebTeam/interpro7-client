import React from 'react';
import T from 'prop-types';
import { noop } from 'lodash-es';

export const format2label = {
  accession: 'Text (List of Accessions)',
  fasta: 'FASTA',
  json: 'JSON',
  tsv: 'TSV',
};
const FormatSelector = ({
  fileType,
  mainEndpoint,
  hasSelectedDB,
  hasSelectedAccession,
}) => (
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
    {/* <option value="ndjson">Newline-delimited JSON</option> */}
    <option value="tsv" disabled={!hasSelectedDB || hasSelectedAccession}>
      {format2label.tsv}
    </option>
    {/* <option value="xml">XML</option> */}
  </select>
);
FormatSelector.propTypes = {
  fileType: T.string,
  mainEndpoint: T.string,
  hasSelectedDB: T.bool,
  hasSelectedAccession: T.bool,
};

export default FormatSelector;
