// @flow
import React from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';

import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import sequenceStyles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ebiStyles, sequenceStyles, fonts, ipro);

const IPScanButton = (
  {
    goToCustomLocation,
    sequence,
    title,
    minWidth,
  } /*: {goToCustomLocation: function, sequence: string | function, title: string, minWidth: string} */,
) => {
  const _handleIPSClick = (event) => {
    event.preventDefault();
    const seq = typeof sequence === 'function' ? sequence() : sequence;
    goToCustomLocation({
      description: {
        main: { key: 'search' },
        search: { type: 'sequence', value: seq },
      },
    });
  };

  return (
    <Link
      to={{
        description: {
          main: { key: 'search' },
          search: { type: 'sequence' },
        },
      }}
      onClick={_handleIPSClick}
    >
      <div
        className={f('sequence-link', 'button', 'hollow')}
        data-icon="&#xf061;"
        style={{ minWidth: minWidth, marginRight: '1rem' }}
      >
        <div className={f('shape', 'ips', 'gray')} />
        <div className={f('shape', 'ips', 'green')} />
        <div className={f('shape', 'ips', 'pale-green')} />
        <div className={f('shape', 'ips', 'red')} />
        <div className={f('shape', 'ips', 'blue')} />
        <span>{title}</span>
      </div>
    </Link>
  );
};
IPScanButton.propTypes = {
  goToCustomLocation: T.func.isRequired,
  sequence: T.oneOfType([T.func, T.string]).isRequired,
  title: T.string,
  minWidth: T.oneOfType([T.number, T.string]),
};

export default connect(null, { goToCustomLocation })(IPScanButton);
