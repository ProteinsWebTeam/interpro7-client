// @flow
import React from 'react';

import { splitSequenceByChunks } from 'utils/sequence';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import sequenceStyles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
// import local from './style.css';
import summary from 'styles/summary.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(
  summary,
  theme,
  ebiStyles,
  sequenceStyles,
  fonts,
  // local,
);
const DownloadButton = ({ accession, sequence }) => {
  return (
    <a
      className={f('button', 'hollow')}
      style={{
        display: 'block',
        minWidth: '290px',
        width: '100%',
        color: 'var(--colors-graydark)',
      }}
      download={`${accession}.fa`}
      href={URL.createObjectURL(
        new Blob([splitSequenceByChunks(sequence, accession, false)], {
          type: 'text/plain',
        }),
      )}
    >
      <span
        className={f('icon', 'icon-common', 'icon-download')}
        data-icon="&#xf019;"
      />
      &nbsp;Download Sequence
    </a>
  );
};

export default DownloadButton;
