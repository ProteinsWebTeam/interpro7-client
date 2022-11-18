// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import sequenceStyles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiStyles, sequenceStyles, fonts, ipro);

const HmmerButton = (
  {
    sequence,
    accession,
    title,
    minWidth,
  } /*: {sequence: string | function, accession?: string, title: string, minWidth: string} */,
) => {
  const _handleHmmerClick = (event) => {
    const seq = typeof sequence === 'function' ? sequence() : sequence;
    const { currentTarget } = event;
    const oldHref = currentTarget.href;
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
        className={f('sequence-link', 'button', 'hollow')}
        data-icon="&#xf061;"
        style={{ minWidth: minWidth }}
      >
        <div className={f('shape', 'hmmer', 'yellow')} />
        <div className={f('shape', 'hmmer', 'red')} />
        <div className={f('shape', 'hmmer', 'blue')} />
        <span>{title}</span>
      </div>
    </Link>
  );
};
HmmerButton.propTypes = {
  sequence: T.oneOfType([T.func, T.string]).isRequired,
  accession: T.string,
  title: T.string,
  minWidth: T.string,
};

export default HmmerButton;
