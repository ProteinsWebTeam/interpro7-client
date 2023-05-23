import React from 'react';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/icons.css';

const css = cssBinder(ipro);

const EntryIcon = ({ type }: { type: string }) => (
  <Tooltip title={`Type: ${type.replace('_', ' ')}`}>
    <interpro-type
      type={type.replace('_', ' ')}
      dimension="4em"
      aria-label="Entry type"
      data-testid="entry-type-icon"
    >
      {
        // IE11 fallback for icons
      }
      <span
        className={css('icon-type', {
          ['icon-family']: type === 'family',
          ['icon-domain']: type === 'domain',
          ['icon-repeat']: type === 'repeat',
          ['icon-hh']: type.replace('_', ' ') === 'homologous superfamily',
          ['icon-site']:
            type.replace('_', ' ') === 'conserved site' ||
            type.replace('_', ' ') === 'binding site' ||
            type.replace('_', ' ') === 'active site' ||
            type === 'ptm',
        })}
      >
        {type === 'family' ? 'F' : null}
        {type === 'domain' ? 'D' : null}
        {type === 'repeat' ? 'R' : null}
        {type.replace('_', ' ') === 'homologous superfamily' ? 'H' : null}
        {type.replace('_', ' ') === 'conserved site' ||
        type.replace('_', ' ') === 'binding site' ||
        type.replace('_', ' ') === 'active site' ||
        type === 'ptm'
          ? 'S'
          : null}
      </span>
    </interpro-type>
  </Tooltip>
);

export default EntryIcon;
