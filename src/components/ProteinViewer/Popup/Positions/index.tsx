import React from 'react';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import localCSS from './style.css';
const css = cssBinder(ipro, localCSS);

type Props = {
  fragments?: Array<ProtVistaFragment>;
  protein?: string;
  goToCustomLocation: typeof goToCustomLocation;
};
const Positions = ({ fragments, protein, goToCustomLocation }: Props) => {
  const handleClick = (start: number, end: number) => () => {
    if (!protein) return;
    goToCustomLocation({
      description: {
        main: { key: 'protein' },
        protein: { accession: protein, db: 'UniProt', detail: 'sequence' },
      },
      hash: `${start}-${end}`,
    });
  };

  return (
    <ul>
      {(fragments || []).map(({ start, end }, i) => (
        <li key={i}>
          <button
            className={css('button', 'secondary', 'coordinates')}
            onClick={handleClick(start, end)}
            style={{
              cursor: protein ? 'pointer' : 'inherit',
            }}
          >
            {start} - {end}
          </button>
        </li>
      ))}
    </ul>
  );
};
export default connect(null, { goToCustomLocation })(Positions);
