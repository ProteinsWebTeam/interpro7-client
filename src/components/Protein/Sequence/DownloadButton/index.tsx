import React from 'react';

import { splitSequenceByChunks } from 'utils/sequence';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import summary from 'styles/summary.css';

const css = cssBinder(summary, fonts);

type Props = { accession: string; sequence: string };
const DownloadButton = ({ accession, sequence }: Props) => {
  return (
    <a
      className={css('vf-button', 'vf-button--secondary', 'vf-button--sm')}
      style={{
        display: 'block',
        minWidth: '200px',
        width: '100%',
        color: 'var(--colors-graydark)',
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
      &nbsp;Download Sequence
    </a>
  );
};

export default DownloadButton;
