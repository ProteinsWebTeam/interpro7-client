import React from 'react';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Link from 'components/generic/Link';

import { DataForProteinChain } from '../';

import cssBinder from 'styles/cssBinder';

import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const css = cssBinder(buttonCSS);

const scrollToElementByID = (id: string) => {
  document.getElementById(id)?.scrollIntoView();
};

const GoToProtVistaMenu = ({ entries }: { entries: DataForProteinChain[] }) => (
  <DropDownButton label="Jump To" icon="&#xf124;">
    <ul>
      {entries.map((e, i) => {
        const elementID = `protvista-${e.chain}-${e.protein.accession || '0'}`;
        return (
          <li key={i}>
            <Link
              className={css('vf-button', 'vf-button--hollow', 'vf-button--sm')}
              to={(customLocation) => ({
                ...customLocation,
                hash: elementID,
              })}
              onClick={() => scrollToElementByID(elementID)}
            >
              Chain {e.chain}
              {e.protein.accession !== null ? ` (${e.protein.accession})` : ''}
            </Link>
          </li>
        );
      })}
    </ul>
  </DropDownButton>
);
export default GoToProtVistaMenu;
