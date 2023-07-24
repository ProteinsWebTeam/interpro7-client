import React from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import sequenceStyles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(sequenceStyles, fonts);

type Props = {
  sequence: string | (() => string);
  accession?: string;
  title: string;
  minWidth: string;
};

const HmmerButton = ({ sequence, accession, title, minWidth }: Props) => {
  const _handleHmmerClick = (event: MouseEvent) => {
    const seq = typeof sequence === 'function' ? sequence() : sequence;
    const currentTarget = event.currentTarget as HTMLAnchorElement;
    const oldHref = currentTarget?.href;
    // Add the sequence as querystring to Hmmer link href
    currentTarget.href += `?seq=${accession ? `>${accession}%0A` : ''}${seq}`;
    // Reset href, but after the click was done
    setTimeout(() => (currentTarget.href = oldHref));
  };
  return (
    <Link
      href="https://www.ebi.ac.uk/Tools/hmmer/search/phmmer"
      onClick={_handleHmmerClick}
      target="_blank"
    >
      <div
        className={css(
          'sequence-link',
          'vf-button',
          'vf-button--secondary',
          'vf-button--sm'
        )}
        data-icon="&#xf061;"
        style={{ minWidth: minWidth }}
      >
        <div className={css('shape', 'hmmer', 'yellow')} />
        <div className={css('shape', 'hmmer', 'red')} />
        <div className={css('shape', 'hmmer', 'blue')} />
        <span>{title}</span>
      </div>
    </Link>
  );
};

export default HmmerButton;
