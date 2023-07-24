import React from 'react';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';

import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import sequenceStyles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(sequenceStyles, fonts);

type Props = {
  goToCustomLocation: typeof goToCustomLocation;
  sequence: string | (() => string);
  title: string;
  minWidth: string;
};

const IPScanButton = ({
  goToCustomLocation,
  sequence,
  title,
  minWidth,
}: Props) => {
  const _handleIPSClick = (event: MouseEvent) => {
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
        className={css(
          'sequence-link',
          'vf-button',
          'vf-button--secondary',
          'vf-button--sm'
        )}
        data-icon="&#xf061;"
        style={{ minWidth: minWidth, marginRight: '1rem' }}
      >
        <div className={css('shape', 'ips', 'gray')} />
        <div className={css('shape', 'ips', 'green')} />
        <div className={css('shape', 'ips', 'pale-green')} />
        <div className={css('shape', 'ips', 'red')} />
        <div className={css('shape', 'ips', 'blue')} />
        <span>{title}</span>
      </div>
    </Link>
  );
};

export default connect(null, { goToCustomLocation })(IPScanButton);
