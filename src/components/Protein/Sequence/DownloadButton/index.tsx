import React from 'react';

import { splitSequenceByChunks } from 'utils/sequence';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(summary, ipro, fonts);

type Props = { accession: string; sequence: string };
const DownloadButton = ({ accession, sequence }: Props) => {
  return (
    <a
      className={css('vf-button', 'vf-button--secondary', 'vf-button--sm')}
      style={{
        display: 'block',
        minWidth: '200px',
        width: '100%',
      }}
      download={`${accession}.fa`}
      href={URL.createObjectURL(
        new Blob([splitSequenceByChunks(sequence, accession, false)], {
          type: 'text/plain',
        })
      )}
    >
      <span
        className={css('icon', 'icon-common', 'icon-download')}
        data-icon="&#xf019;"
      />
      &nbsp;Download sequence (FASTA)
    </a>
  );
};

export default DownloadButton;
