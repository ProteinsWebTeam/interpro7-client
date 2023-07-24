import React from 'react';
import config from 'config';

import cssBinder from 'styles/cssBinder';
import styles from '../style.css';

const css = cssBinder(styles);

const accessionDisplay = new Set(['protein', 'structure', 'proteome', 'set']);

const mapNameToClass = new Map([
  ['domain', 'title-id-domain'],
  ['family', 'title-id-family'],
  ['repeat', 'title-id-repeat'],
  ['unknown', 'title-id-unknown'],
  ['conserved_site', 'title-id-site'],
  ['binding_site', 'title-id-site'],
  ['active_site', 'title-id-site'],
  ['ptm', 'title-id-site'],
  ['homologous_superfamily', 'title-id-hh'],
]);

type Props = {
  accession?: string;
  db?: string;
  type?: string;
  mainType: string;
  isIPScanResult: boolean;
};

const lightFontDBs = ['ssf', 'pfam'];

const AccessionTag = ({
  accession,
  db,
  type,
  mainType,
  isIPScanResult = false,
}: Props) => {
  const isEntry = mainType === 'entry';
  return (
    <div className={css('title-id')} data-testid="accession">
      {
        // Red, Green for domains,  Purple for sites, and Blue for Homologous accession: for InterPro page only
        isEntry && type && db && db.toLowerCase() === 'interpro' && (
          <span className={css(mapNameToClass.get(type))}>{accession}</span>
        )
      }
      {
        // Blue accession: for Member Database and Unknown entry-type
        isEntry && type && db && db.toLowerCase() !== 'interpro' && (
          <span
            style={{
              backgroundColor: config.colors.get(db),
            }}
            className={css('title-id-md', { white: lightFontDBs.includes(db) })}
          >
            {accession}
          </span>
        )
      }
      {
        // greyblueish accession: for protein , structure, and proteomes and no accession for tax
        accessionDisplay.has(mainType) &&
          db !== 'taxonomy' &&
          !isIPScanResult && (
            // for proteins, structures and proteomes (no accession in title for taxonomy and sets)
            <span className={css('title-id-other')}>{accession}</span>
          )
      }
    </div>
  );
};

export default AccessionTag;
